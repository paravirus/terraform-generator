document.addEventListener('DOMContentLoaded', () => {
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const resourceTypeSelect = document.getElementById('resourceType');
    const complianceTypeSelect = document.getElementById('complianceType');
    const downloadButton = document.getElementById('downloadButton');
    const terraformCodeTextarea = document.getElementById('terraformCode');
    const terraformModuleBox = document.getElementById('terraformModuleBox');

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
        clearGeneratedCode(); // Clear generated code when changing cloud provider
    };

    const clearGeneratedCode = () => {
        terraformCodeTextarea.value = '';
        terraformModuleBox.style.display = 'none';
        downloadButton.style.display = 'none';
    };

    cloudProviderSelect.addEventListener('change', () => {
        populateResourceTypes();
    });

    complianceTypeSelect.addEventListener('change', () => {
        clearGeneratedCode(); // Clear generated code when changing compliance type
    });

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
        terraformCodeTextarea.value = moduleCode;
        terraformModuleBox.style.display = 'block';
        downloadButton.style.display = 'block';
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
        terraformCodeTextarea.select();
        document.execCommand('copy');
        alert('Module code copied to clipboard!');
    });

    downloadButton.addEventListener('click', () => {
        const moduleName = resourceTypeSelect.value.toUpperCase();
        const complianceStandard = complianceTypeSelect.value.toUpperCase();
        const fileName = `${moduleName}-${complianceStandard}.tfvars`;
        const content = terraformCodeTextarea.value;
        downloadFile(fileName, content);
    });

    const downloadFile = (filename, content) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
});
