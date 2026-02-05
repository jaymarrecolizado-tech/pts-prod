/**
 * Project Implementation Tracking System - Main Application
 * Production-ready version with modular architecture
 */

(function() {
    'use strict';

    const App = {
        init() {
            this.bindCDNFallbacks();
            this.bindEvents();
            this.bindForms();
            this.bindButtons();

            DataService.init(this.getInitialData());
            UIService.init();
            MapService.init('map');
            ChartService.init();

            this.createCharts();
            this.refreshAll();
        },

        bindCDNFallbacks() {
            window.addEventListener('error', (e) => {
                if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
                    console.error('CDN resource failed to load:', e.target.src || e.target.href);
                    UIService.showToast('Some resources failed to load. Please check your internet connection.', 5000);
                }
            });
        },

        getInitialData() {
            return [
                { siteCode: "UNDP-GI-0009A", projectName: "Free-WIFI for All", siteName: "Raele Barangay Hall - AP 1", barangay: "Raele", municipality: "Itbayat", province: "Batanes", district: "District I", latitude: 20.728794, longitude: 121.804235, activationDate: "April 30, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-GI-0009B", projectName: "Free-WIFI for All", siteName: "Raele Barangay Hall - AP 2", barangay: "Raele", municipality: "Itbayat", province: "Batanes", district: "District I", latitude: 20.728794, longitude: 121.804235, activationDate: "April 30, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-GI-0010A", projectName: "Free-WIFI for All", siteName: "Salagao Barangay Hall - AP 1", barangay: "Salagao", municipality: "Ivana", province: "Batanes", district: "District I", latitude: 20.373518, longitude: 121.915566, activationDate: "May 08, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-GI-0010B", projectName: "Free-WIFI for All", siteName: "Salagao Barangay Hall - AP 2", barangay: "Salagao", municipality: "Ivana", province: "Batanes", district: "District I", latitude: 20.373518, longitude: 121.915566, activationDate: "May 08, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-IP-0031A", projectName: "Free-WIFI for All", siteName: "Santa Lucia Barangay Hall - AP 1", barangay: "Santa Lucia", municipality: "Itbayat", province: "Batanes", district: "District I", latitude: 20.784595, longitude: 121.840664, activationDate: "May 01, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-IP-0031B", projectName: "Free-WIFI for All", siteName: "Santa Lucia Barangay Hall - AP 2", barangay: "Santa Lucia", municipality: "Itbayat", province: "Batanes", district: "District I", latitude: 20.784595, longitude: 121.840664, activationDate: "May 01, 2024", status: "Done", notes: "" },
                { siteCode: "UNDP-IP-0032A", projectName: "Free-WIFI for All", siteName: "Santa Maria Barangay Hall - AP 1", barangay: "Santa Maria", municipality: "Itbayat", province: "Batanes", district: "District I", latitude: 20.785447, longitude: 121.842022, activationDate: "April 30, 2024", status: "Done", notes: "" },
                { siteCode: "CYBER-1231231", projectName: "PNPKI/CYBER", siteName: "Iguig National High School", barangay: "Ajat", municipality: "Iguig", province: "Cagayan", district: "District III", latitude: 17.7492984, longitude: 121.7350356, activationDate: "March 20, 2025", status: "Done", notes: "" },
                { siteCode: "IIDB-1231231", projectName: "IIDB", siteName: "Iguig National High School", barangay: "Ajat", municipality: "Iguig", province: "Cagayan", district: "District III", latitude: 17.7492984, longitude: 121.7350356, activationDate: "March 20, 2025", status: "Done", notes: "" },
                { siteCode: "eLGU-1231231", projectName: "DigiGov-eLGU", siteName: "Iguig National High School", barangay: "Ajat", municipality: "Iguig", province: "Cagayan", district: "District III", latitude: 17.7492984, longitude: 121.7350356, activationDate: "March 20, 2026", status: "Pending", notes: "" }
            ];
        },

        bindEvents() {
            document.getElementById('search-projects')?.addEventListener('input', UIService.bindSearchDebounced);

            document.querySelectorAll('#filter-all, #filter-done, #filter-pending').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('#filter-all, #filter-done, #filter-pending').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.id === 'filter-all' ? 'all' : btn.id === 'filter-done' ? 'Done' : 'Pending';
                    MapService.renderProjects(DataService.getAllProjects(), { statusFilter: filter });
                });
            });

            document.getElementById('view-all-projects')?.addEventListener('click', () => {
                UIService.switchTab('projects');
            });

            document.getElementById('add-project-btn')?.addEventListener('click', () => {
                UIService.switchTab('manual-entry');
            });

            this.setupFileUpload();
        },

        bindForms() {
            const form = document.getElementById('manual-entry-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleManualEntry();
                });

                document.getElementById('clear-form-btn')?.addEventListener('click', () => {
                    form.reset();
                });
            }
        },

        bindButtons() {
            document.getElementById('export-btn')?.addEventListener('click', () => {
                DataService.downloadCSV();
                UIService.showSuccess('Data exported successfully!');
            });

            document.getElementById('refresh-btn')?.addEventListener('click', () => {
                this.refreshAll();
                UIService.showSuccess('Data refreshed!');
            });

            document.getElementById('download-template')?.addEventListener('click', () => {
                this.downloadTemplate();
            });

            document.getElementById('import-data-btn')?.addEventListener('click', () => {
                this.importValidatedData();
            });

            document.getElementById('download-errors-btn')?.addEventListener('click', () => {
                this.downloadErrorReport();
            });
        },

        setupFileUpload() {
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');

            if (!dropZone || !fileInput) return;

            dropZone.addEventListener('click', () => fileInput.click());

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        },

        handleFileUpload(file) {
            if (!file) return;

            const validTypes = ['.csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.some(type => file.name.endsWith(type) || file.type === type)) {
                UIService.showError('Please upload a valid CSV file');
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csvContent = e.target.result;
                    const result = Papa.parse(csvContent, {
                        header: true,
                        skipEmptyLines: true
                    });

                    const validationResult = this.validateCSVData(result.data);

                    this.showValidationResults(validationResult);

                    window.pendingImportData = validationResult.validProjects;

                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    UIService.showError('Failed to parse CSV file');
                }
            };

            reader.onerror = () => {
                UIService.showError('Failed to read file');
            };

            reader.readAsText(file);
        },

        validateCSVData(data) {
            const validProjects = [];
            const errors = [];
            const warnings = [];

            data.forEach((row, index) => {
                const validation = Validator.validateCSVRow(row, index, DataService.getAllProjects());

                if (validation.valid) {
                    const sanitized = Sanitizer.sanitizeProject(validation.project);
                    validProjects.push(sanitized);
                } else {
                    errors.push(...validation.errors);
                }

                if (validation.warnings.length > 0) {
                    warnings.push(...validation.warnings);
                }
            });

            return { validProjects, errors, warnings, hasErrors: errors.length > 0 };
        },

        showValidationResults(result) {
            const container = document.getElementById('validation-results');
            const messages = document.getElementById('validation-messages');

            if (!container || !messages) return;

            container.classList.remove('hidden');

            let html = '';

            if (result.errors.length > 0) {
                html += `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #e74c3c; margin-bottom: 10px;">Errors (${result.errors.length})</h4>
                        <ul class="error-list">
                            ${result.errors.slice(0, 10).map(e => `<li>${Sanitizer.sanitizeHTML(e)}</li>`).join('')}
                            ${result.errors.length > 10 ? `<li>...and ${result.errors.length - 10} more errors</li>` : ''}
                        </ul>
                    </div>
                `;
            }

            if (result.warnings.length > 0) {
                html += `
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(243, 156, 18, 0.1); border-radius: 4px;">
                        <h4 style="color: #f39c12; margin-bottom: 5px;">Warnings (${result.warnings.length})</h4>
                        <p style="font-size: 13px; color: #666;">${Sanitizer.sanitizeHTML(result.warnings[0])}</p>
                    </div>
                `;
            }

            html += `
                <div class="success-message">
                    <strong>${result.validProjects.length}</strong> projects ready to import
                </div>
            `;

            messages.innerHTML = html;
        },

        importValidatedData() {
            if (!window.pendingImportData || window.pendingImportData.length === 0) {
                UIService.showError('No valid data to import');
                return;
            }

            const existingCount = DataService.getAllProjects().length;
            window.pendingImportData.forEach(project => DataService.projects.push(project));
            DataService.saveToStorage();

            const newCount = DataService.getAllProjects().length;
            const imported = newCount - existingCount;

            this.refreshAll();

            document.getElementById('validation-results')?.classList.add('hidden');
            window.pendingImportData = [];

            UIService.showSuccess(`${imported} projects imported successfully!`);
        },

        downloadErrorReport() {
            if (!window.pendingImportData || window.pendingImportData.length === 0) {
                UIService.showError('No error report to download');
                return;
            }

            const errorData = DataService.getAllProjects().map(p => ({
                'Site Code': p.siteCode,
                'Project Name': p.projectName,
                'Status': p.status,
                'Error': 'Duplicate or invalid'
            }));

            const csv = Papa.unparse(errorData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `error_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        },

        downloadTemplate() {
            const template = [
                ['Site Code', 'Project Name', 'Site Name', 'Barangay', 'Municipality', 'Province', 'District', 'Latitude', 'Longitude', 'Date of Activation', 'Status', 'Notes'],
                ['EXAMPLE-001', 'Free-WIFI for All', 'Sample Barangay Hall', 'Sample Barangay', 'Sample Municipality', 'Batanes', 'District I', '20.728794', '121.804235', 'April 30, 2024', 'Done', '']
            ];

            const csv = Papa.unparse(template);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'project_template.csv';
            link.click();
        },

        handleManualEntry() {
            const form = document.getElementById('manual-entry-form');
            if (!form) return;

            const project = {
                siteCode: document.getElementById('site-code').value.trim(),
                projectName: document.getElementById('project-name').value.trim(),
                siteName: document.getElementById('site-name').value.trim(),
                barangay: document.getElementById('barangay').value.trim(),
                municipality: document.getElementById('municipality').value.trim(),
                province: document.getElementById('province').value.trim(),
                district: document.getElementById('district').value.trim(),
                latitude: parseFloat(document.getElementById('latitude').value),
                longitude: parseFloat(document.getElementById('longitude').value),
                activationDate: Validator.normalizeDate(document.getElementById('activation-date').value),
                status: document.getElementById('status').value,
                notes: document.getElementById('notes').value.trim()
            };

            const result = DataService.addProject(project);

            if (result.success) {
                form.reset();
                this.refreshAll();
                UIService.showSuccess('Project added successfully!');
            } else {
                UIService.showError(result.errors.join(', '));
            }
        },

        createCharts() {
            ChartService.createStatusChart('status-chart');
            ChartService.createTimelineChart('timeline-chart');
            ChartService.createProvinceChart('province-chart');
            ChartService.createStatusDistributionChart('status-distribution-chart');
            ChartService.createProvinceDetailedChart('province-detailed-chart');
            ChartService.createTimelineDetailedChart('timeline-detailed-chart');
            ChartService.createPendingDurationChart('pending-duration-chart');
            ChartService.createCompletionRateChart('completion-rate-chart');
        },

        refreshAll() {
            const projects = DataService.getAllProjects();

            MapService.renderProjects(projects);
            UIService.renderRecentProjects();
            UIService.renderAllProjectsTable();
            UIService.updateStats();
            ChartService.updateAllCharts();
        }
    };

    window.viewProject = function(siteCode) {
        const project = DataService.getProject(siteCode);
        if (project) {
            MapService.highlightProject(siteCode);
            UIService.switchTab('dashboard');
        }
    };

    window.deleteProject = function(siteCode) {
        if (confirm(`Are you sure you want to delete project "${siteCode}"?`)) {
            const result = DataService.deleteProject(siteCode);
            if (result.success) {
                App.refreshAll();
                UIService.showSuccess('Project deleted successfully!');
            } else {
                UIService.showError(result.errors.join(', '));
            }
        }
    };

    window.addEventListener('DOMContentLoaded', () => {
        App.init();
    });

})();
