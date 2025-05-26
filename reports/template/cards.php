<div id="metric-cards" class="row"></div>

<style>
.card-item {
    border: 1px solid #e2e2e2;
    border-radius: 0.5rem;
    background-color: #ffffff;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    text-align: center;
}
.card-value {
    font-size: 1.25rem;
    font-weight: 600;
}
.card-name {
    color: #6b7280;
    font-size: 0.875rem;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    function slugify(name) {
        if (!name) return '';
        const paren = name.match(/\(([^)]+)\)$/);
        if (paren) return paren[1].toLowerCase();
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    }
    const cardApp = {
        metrics: Array.isArray(currentState.card_metrics) ? [...currentState.card_metrics] : [],
        data: window.reportMetrics || {},
        init() {
            window.addEventListener('metricsChanged', (e) => {
                this.metrics = e.detail || [];
                this.render();
            });
            window.addEventListener('reportDataUpdated', (e) => {
                this.data = e.detail || {};
                this.render();
            });
            this.render();
        },
        getValue(slug) {
            const group = Object.keys(this.data)[0];
            if (!group || !this.data[group]) return '-';
            const val = this.data[group][slug];
            return val !== undefined ? val : '-';
        },
        render() {
            const container = document.getElementById('metric-cards');
            if (!container) return;
            container.innerHTML = '';
            const group = Object.keys(this.data)[0];
            if (!group) return;
            this.metrics.forEach(id => {
                const info = window.metricStore.getById(Number(id));
                if (!info) return;
                const slug = info.slug || slugify(info.name || '');
                const value = this.getValue(slug);
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-3';
                col.innerHTML = `<div class="card-item"><div class="card-name">${info.name}</div><div class="card-value" data-slug="${slug}">${value}</div></div>`;
                container.appendChild(col);
            });
        }
    };
    cardApp.init();
    window.cardApp = cardApp;
});
</script>