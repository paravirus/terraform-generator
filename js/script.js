document.addEventListener('DOMContentLoaded', () => {
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const resourceTypeSelect = document.getElementById('resourceType');
    const fetchModuleButton = document.getElementById('fetchModuleButton');
    const terraformCodeTextarea = document.getElementById('terraformCode');
    const copyButton = document.getElementById('copyButton');

    // Cloud provider to GitHub repository mapping
    const repositories = {
        AWS: 'https://api.github.com/repos/paravirus/terraform-poc/contents/terraform_modules/AWS',
        Azure: 'https://api.github.com/repos/paravirus/terraform-poc/contents/terraform_modules/AZURE'
    };

    // Function to populate resource type dropdown based on cloud provider selection
    const populateResourceTypes = async () => {
        const cloudProvider = cloudProviderSelect.value;
        const repoURL = repositories[cloudProvider];
        if (!repoURL) {
            return;
        }
        try {
            const response = await fetch(repoURL);
            if (!response.ok) {
                throw new Error('Error fetching resource types.');
            }
            const data = await response.json();
            resourceTypeSelect.innerHTML = ''; // Clear previous options
            data.forEach(item => {
                if (item.type === 'dir') {
                    const option = document.createElement('option');
                    option.value = item.name;
                    option.textContent = item.name.toUpperCase();
                    resourceTypeSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    // Event listener for cloud provider selection
    cloudProviderSelect.addEventListener('change', populateResourceTypes);

    // Event listener for fetch module button
    fetchModuleButton.addEventListener('click', async () => {
        const cloudProvider = cloudProviderSelect.value;
        const resourceType = resourceTypeSelect.value;
        const moduleCode = await fetchModuleCode(cloudProvider, resourceType);
        terraformCodeTextarea.value = moduleCode;
    });

    // Function to fetch module code based on cloud provider and resource type
    const fetchModuleCode = async (cloudProvider, resourceType) => {
        const response = await fetch(`https://raw.githubusercontent.com/paravirus/terraform-poc/main/terraform_modules/${cloudProvider}/${resourceType}/${resourceType}.tf`);
        if (!response.ok) {
            throw new Error('Error fetching module code.');
        }
        const data = await response.text();
        return data;
    };

    // Event listener for copy button
    copyButton.addEventListener('click', () => {
        terraformCodeTextarea.select();
        document.execCommand('copy');
        alert('Module code copied to clipboard!');
    });

    // Initial population of resource type dropdown
    populateResourceTypes();
});
