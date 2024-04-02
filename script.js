document.addEventListener('DOMContentLoaded', () => {
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const resourceTypeSelect = document.getElementById('resourceType');
    const complianceTypeSelect = document.getElementById('complianceType');

    const resourceTypes = {
        AWS: ['EC2', 'VPC', 'EKS','S3'],
        AZURE: ['VM', 'AKS', 'Network-Security-Group', 'postgresql']
    };

    const populateResourceTypes = () => {
        const cloudProvider = cloudProviderSelect.value;
        const types = resourceTypes[cloudProvider] || [];
        resourceTypeSelect.innerHTML = '';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.toUpperCase();
            resourceTypeSelect.appendChild(option);
        });
    };

    cloudProviderSelect.addEventListener('change', populateResourceTypes);

    populateResourceTypes();

    const fetchModuleCode = async (cloudProvider, resourceType, complianceType) => {
        try {
            let moduleType = '';
            if (complianceType === 'NIST') {
                moduleType = `/${resourceType}/${complianceType}/${resourceType}.tf`;
            } else {
                moduleType = `/${resourceType}/${resourceType}.tf`;
            }
            const response = await fetch(`https://raw.githubusercontent.com/paravirus/terraform-poc/main/terraform_modules/${cloudProvider}${moduleType}`);
            if (!response.ok) {
                throw new Error('Error fetching module code.');
            }
            return response.text();
        } catch (error) {
            console.error('Error fetching module code:', error);
            throw new Error('Error fetching module code.');
        }
    };

    const displayModuleCode = (moduleCode) => {
        const terraformCodeTextarea = document.getElementById('terraformCode');
        terraformCodeTextarea.value = moduleCode;
        const terraformModuleBox = document.getElementById('terraformModuleBox');
        terraformModuleBox.style.display = 'block';
    };

    const form = document.getElementById('cloudProviderForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const cloudProvider = cloudProviderSelect.value;
        const resourceType = resourceTypeSelect.value;
        const complianceType = complianceTypeSelect.value;
        try {
            console.log('Fetching module code...');
            const moduleCode = await fetchModuleCode(cloudProvider, resourceType, complianceType);
            console.log('Module code fetched:', moduleCode);
            displayModuleCode(moduleCode);
        } catch (error) {
            console.error('Error generating module:', error);
            alert('Error generating module. Please try again.');
        }
    });

    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', () => {
        const terraformCodeTextarea = document.getElementById('terraformCode');
        terraformCodeTextarea.select();
        document.execCommand('copy');
        alert('Module code copied to clipboard!');
    });
});
