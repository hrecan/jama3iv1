/**
 * Class representing the Database Administration interface
 */
class DatabaseAdmin {
    /**
     * Initialize the Database Admin interface
     */
    constructor() {
        this.token = localStorage.getItem('token');
        if (!this.token) {
            console.log('No token found, redirecting to login');
            window.location.href = '/views/login.html';
            return;
        }

        this.currentPage = 1;
        this.initializeElements();
        this.itemsPerPage = parseInt(this.perPageSelect.value);
        this.setupEventListeners();
        this.loadTables();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        const elements = {
            tableSelect: 'tableSelect',
            contentContainer: 'contentContainer',
            addButton: 'addButton',
            searchInput: 'searchInput',
            searchButton: 'searchButton',
            errorMessageElement: 'errorMessage',
            successMessageElement: 'successMessage',
            perPageSelect: 'perPage',
            paginationElement: 'pagination',
            currentTableSpan: 'currentTable',
            tableBody: 'contentBody',
            tableHeaders: 'tableHeaders'
        };

        // Initialize all elements as class properties
        for (const [key, id] of Object.entries(elements)) {
            this[key] = document.getElementById(id);
        }

        // Verify required elements
        const missingElements = Object.entries(elements)
            .filter(([key]) => !this[key])
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Missing DOM elements:', missingElements);
            throw new Error('Required DOM elements not found');
        }
    }

    /**
     * Setup event listeners for various UI elements
     */
    setupEventListeners() {
        this.tableSelect.addEventListener('change', () => this.handleTableChange());
        this.searchButton?.addEventListener('click', () => this.handleSearch());
        this.perPageSelect?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.loadContent(1);
        });
        this.addButton?.addEventListener('click', () => this.createForm(this.tableSelect.value));
    }

    /**
     * Show a message to the user
     * @param {HTMLElement} element - The element to show the message in
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the message in milliseconds
     */
    showMessage(element, message, duration = 3000) {
        if (!element) return;
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    /**
     * Load available database tables
     */
    async loadTables() {
        try {
            console.log('Loading tables...');
            const response = await this.makeRequest('/api/database/tables');
            const tables = await response.json();
            
            this.tableSelect.innerHTML = '<option value="">Select a table</option>';
            tables.forEach(table => {
                const option = document.createElement('option');
                option.value = table;
                option.textContent = table;
                this.tableSelect.appendChild(option);
            });

            // Auto-select ghtusr if present
            if (tables.includes('ghtusr')) {
                this.tableSelect.value = 'ghtusr';
                this.currentTableSpan.textContent = 'ghtusr';
                await this.loadContent(1);
                this.contentContainer.style.display = 'block';
                this.addButton.style.display = 'block';
            }
        } catch (error) {
            this.handleError('Error loading tables', error);
        }
    }

    /**
     * Load content for the selected table
     * @param {number} page - Page number to load
     */
    async loadContent(page = 1) {
        try {
            const selectedTable = this.tableSelect.value;
            if (!selectedTable) {
                console.error('No table selected');
                return;
            }

            const response = await this.makeRequest(
                `/api/database/content/${selectedTable}?page=${page}&limit=${this.itemsPerPage}`
            );
            const data = await response.json();
            
            this.displayData(data.data);
            if (data.pagination?.total) {
                this.updatePagination(data.pagination.total);
            }
        } catch (error) {
            this.handleError('Error loading content', error);
        }
    }

    /**
     * Display data in the table
     * @param {Array} data - Data to display
     */
    displayData(data) {
        if (!this.tableBody) return;

        if (data?.length > 0) {
            const columns = Object.keys(data[0]);
            if (this.tableHeaders) {
                this.tableHeaders.innerHTML = columns.map(col => `<th>${col}</th>`).join('') + '<th>Actions</th>';
            }
        }

        this.tableBody.innerHTML = '';
        if (!data?.length) {
            this.tableBody.innerHTML = '<tr><td colspan="100%" class="text-center">No data available</td></tr>';
            return;
        }

        data.forEach(record => {
            const tr = document.createElement('tr');
            const idField = Object.keys(record).find(key => key.toLowerCase().endsWith('_id'));
            const idValue = record[idField];

            tr.innerHTML = Object.values(record).map(value => 
                `<td>${value ?? ''}</td>`
            ).join('') + `
            <td>
                <button class="btn btn-sm btn-danger" onclick="databaseAdmin.deleteRecord('${idValue}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
            this.tableBody.appendChild(tr);
        });
    }

    /**
     * Update pagination controls
     * @param {number} total - Total number of items
     */
    updatePagination(total) {
        if (!this.paginationElement) return;

        const totalPages = Math.ceil(total / this.itemsPerPage);
        this.paginationElement.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = `btn btn-sm ${i === this.currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
            button.textContent = i;
            button.onclick = () => {
                this.currentPage = i;
                this.loadContent(i);
            };
            this.paginationElement.appendChild(button);
        }
    }

    /**
     * Get the structure of a table
     * @param {string} tableName - Name of the table
     */
    async getTableStructure(tableName) {
        try {
            const response = await this.makeRequest(`/api/database/structure/${tableName}`);
            return await response.json();
        } catch (error) {
            this.handleError('Error getting table structure', error);
            return null;
        }
    }

    /**
     * Create a form for adding/editing records
     * @param {string} tableName - Name of the table
     */
    async createForm(tableName) {
        try {
            const structure = await this.getTableStructure(tableName);
            if (!structure) return;

            const form = document.createElement('form');
            form.className = 'needs-validation';
            form.noValidate = true;

            structure.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                
                const label = document.createElement('label');
                label.textContent = field.column_name;
                
                const input = document.createElement('input');
                input.className = 'form-control';
                input.name = field.column_name;
                input.required = !field.is_nullable;
                
                if (field.data_type.includes('int')) {
                    input.type = 'number';
                } else if (field.data_type.includes('date')) {
                    input.type = 'date';
                } else {
                    input.type = 'text';
                }

                formGroup.appendChild(label);
                formGroup.appendChild(input);
                form.appendChild(formGroup);
            });

            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'btn btn-primary mt-3';
            submitBtn.textContent = 'Submit';
            form.appendChild(submitBtn);

            form.onsubmit = (e) => this.handleFormSubmit(e, tableName);

            const modalBody = document.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = '';
                modalBody.appendChild(form);
            }
        } catch (error) {
            this.handleError('Error creating form', error);
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     * @param {string} tableName - Name of the table
     */
    async handleFormSubmit(e, tableName) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await this.makeRequest(`/api/database/content/${tableName}`, {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showMessage(this.successMessageElement, 'Record added successfully');
                this.loadContent(this.currentPage);
                // Close modal if using Bootstrap
                const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
                modal?.hide();
            }
        } catch (error) {
            this.handleError('Error submitting form', error);
        }
    }

    /**
     * Handle table change event
     */
    async handleTableChange() {
        const selectedTable = this.tableSelect.value;
        console.log('Selected table:', selectedTable);

        if (selectedTable) {
            this.currentTableSpan.textContent = selectedTable;
            this.contentContainer.style.display = 'block';
            this.addButton.style.display = 'block';
            await this.loadContent(1);
        } else {
            this.contentContainer.style.display = 'none';
            this.addButton.style.display = 'none';
        }
    }

    /**
     * Handle search functionality
     */
    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) return;

        try {
            const selectedTable = this.tableSelect.value;
            const response = await this.makeRequest(
                `/api/database/search/${selectedTable}?term=${encodeURIComponent(searchTerm)}`
            );
            const data = await response.json();
            this.displayData(data);
        } catch (error) {
            this.handleError('Error performing search', error);
        }
    }

    /**
     * Delete a record
     * @param {string} id - ID of the record to delete
     */
    async deleteRecord(id) {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const selectedTable = this.tableSelect.value;
            const response = await this.makeRequest(`/api/database/content/${selectedTable}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showMessage(this.successMessageElement, 'Record deleted successfully');
                this.loadContent(this.currentPage);
            }
        } catch (error) {
            this.handleError('Error deleting record', error);
        }
    }

    /**
     * Make an API request with proper headers
     * @param {string} url - API endpoint
     * @param {Object} options - Fetch options
     */
    async makeRequest(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response;
    }

    /**
     * Handle errors consistently
     * @param {string} context - Context where the error occurred
     * @param {Error} error - The error object
     */
    handleError(context, error) {
        console.error(`${context}:`, error);
        this.showMessage(this.errorMessageElement, `Error: ${error.message}`);
    }
}

// Initialize the Database Admin interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.databaseAdmin = new DatabaseAdmin();
});
