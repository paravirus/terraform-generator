document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const resourceTypeSelect = document.getElementById('resourceType');
    const fetchModuleButton = document.getElementById('fetchModuleButton');
    const terraformCodeTextarea = document.getElementById('terraformCode');
    const copyButton = document.getElementById('copyButton');

    // Cloud provider to resource type mapping
    const resourceTypes = {
        AWS: ['EC2', 'VPC'],
        AZURE: ['VM']
    };

    // Function to populate resource type dropdown based on cloud provider selection
    const populateResourceTypes = () => {
        console.log('Populating resource types');
        const cloudProvider = cloudProviderSelect.value;
        console.log('Selected cloud provider:', cloudProvider);
        const types = resourceTypes[cloudProvider] || [];
        console.log('Available resource types:', types);
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

    // Event listener for fetch module button
    fetchModuleButton.addEventListener('click', async () => {
        const cloudProvider = cloudProviderSelect.value;
        const resourceType = resourceTypeSelect.value;
        console.log('Fetching module code for:', cloudProvider, resourceType);
        const moduleCode = await fetchModuleCode(cloudProvider, resourceType);
        terraformCodeTextarea.value = moduleCode;
    });

    // Function to fetch module code based on cloud provider and resource type
    const fetchModuleCode = async (cloudProvider, resourceType) => {
        console.log('Fetching module code:', cloudProvider, resourceType);
        const response = await fetch(`https://api.github.com/repos/paravirus/terraform-poc/contents/terraform_modules/${cloudProvider}/${resourceType}/${resourceType}.tf`);
        if (!response.ok) {
            throw new Error('Error fetching module code.');
        }
        const data = await response.json();
        return atob(data.content); // Decode base64 content
    };

    // Event listener for copy button
    copyButton.addEventListener('click', () => {
        terraformCodeTextarea.select();
        document.execCommand('copy');
        alert('Module code copied to clipboard!');
    });
});
