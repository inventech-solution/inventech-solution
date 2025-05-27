<div x-data="reportTable" x-cloak class="bg-white p-4 rounded-xl shadow-sm mb-6" style="border:1px solid #e2e2e2;">
    <table id="creativeTable"
           data-toggle="table"
           data-click-to-select="true"
           data-search="true"
           data-show-columns="true"
           data-show-export="true"
           data-export-types='["excel","pdf"]'
           data-pagination="true"
           data-reorderable-columns="true"
           data-resizable="true"
           data-fixed-columns="true"
           data-fixed-number="2"
           class="table table-bordered"></table>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('reportTable', () => ({
        metrics: [],
        init() {
            const raw = <?php echo json_encode($table_metrics_json ?? '[]'); ?>;
            this.metrics = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
            currentState.table_metrics = this.metrics.map(m => m.id);
            window.reportTableComponent = this;
            window.addEventListener('reportDataUpdated', e => {
                const data = this.transform(e.detail || {});
                $('#creativeTable').bootstrapTable({
                    columns: this.buildColumns(),
                    data: data
                });
            });
        },
        buildColumns() {
            const cols = [
                { field: 'state', checkbox: true },
                { field: 'group', title: currentState.groupBy || 'Group', sortable: true }
            ];
            this.metrics.forEach(m => {
                const slug = this.slugify(m.apiName || m.name);
                cols.push({ field: slug, title: m.name, sortable: true });
            });
            cols.push({ field: 'add', title: 'Add Metric', formatter: this.addFormatter });
            return cols;
        },
        addFormatter() {
            return '<button type="button" class="btn btn-sm btn-outline-primary add-metric-btn">+ Add</button>';
        },
        transform(reportMetrics) {
            const rows = [];
            for (const group in reportMetrics) {
                const metrics = reportMetrics[group].metrics || {};
                const row = { group };
                this.metrics.forEach(m => {
                    const slug = this.slugify(m.apiName || m.name);
                    let val = metrics[slug];
                    if (val === undefined || val === null || val === '') {
                        row[slug] = '-';
                        return;
                    }
                    if (m.format === 'currency') {
                        const symbol = window.currencySymbol || '$';
                        row[slug] = symbol + val;
                    } else if (m.format === 'percentage') {
                        row[slug] = val + '%';
                    } else {
                        row[slug] = val;
                    }
                });
                rows.push(row);
            }
            return rows;
        },
        slugify(name) {
            return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        }
    }));
});

// Simple handler for adding metrics on button click
document.addEventListener('click', function(e){
    if(e.target.classList.contains('add-metric-btn')){
        const metricName = prompt('Enter metric name to add');
        if(!metricName) return;
        const metric = window.metricStore.all.find(m => m.name.toLowerCase() === metricName.toLowerCase());
        if(metric){
            const table = window.reportTableComponent;
            if(table && !table.metrics.find(m => m.id == metric.id)){
                table.metrics.push(metric);
                currentState.table_metrics = table.metrics.map(m => m.id);
                unsavedChanges = true;
                const data = table.transform(window.reportMetrics || {});
                $('#creativeTable').bootstrapTable('destroy').bootstrapTable({
                    columns: table.buildColumns(),
                    data: data
                });
            }
        }else{
            alert('Metric not found');
        }
    }
});
</script>
