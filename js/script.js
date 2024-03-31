document.addEventListener('DOMContentLoaded', () => {
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const resourceTypeSelect = document.getElementById('resourceType');

    // Cloud provider to resource type mapping
    const resourceTypes = {
        AWS: ['EC2', 'VPC'],
        AZURE: ['VM']
    };

    // Function to populate resource type dropdown based on cloud provider selection
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

    // Event listener for cloud provider selection
    cloudProviderSelect.addEventListener('change', populateResourceTypes);

    // Initial population of resource type dropdown
    populateResourceTypes();

    // Function to fetch module code based on cloud provider and resource type
    const fetchModuleCode = async (cloudProvider, resourceType) => {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/paravirus/terraform-poc/main/terraform_modules/${cloudProvider}/${resourceType}/${resourceType}.tf`);
            if (!response.ok) {
                throw new Error('Error fetching module code.');
            }
            return response.text();
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching module code.');
        }
    };

    // Function to display module code in the textarea
    const displayModuleCode = (moduleCode) => {
        const terraformCodeTextarea = document.getElementById('terraformCode');
        terraformCodeTextarea.value = moduleCode;
        const terraformModuleBox = document.getElementById('terraformModuleBox');
        terraformModuleBox.style.display = 'block';
    };

    // Handle form submission
    const form = document.getElementById('cloudProviderForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const cloudProvider = cloudProviderSelect.value;
        const resourceType = resourceTypeSelect.value;
        try {
            const moduleCode = await fetchModuleCode(cloudProvider, resourceType);
            displayModuleCode(moduleCode);
        } catch (error) {
            console.error(error);
            alert('Error fetching module code.');
        }
    });

    // Copy module code to clipboard
    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', () => {
        const terraformCodeTextarea = document.getElementById('terraformCode');
        terraformCodeTextarea.select();
        document.execCommand('copy');
        alert('Module code copied to clipboard!');
    });
});
