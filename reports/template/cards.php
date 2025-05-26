<div id="cards-loading" class="text-center py-3">Loading...</div>
<div id="metric-cards" class="row" style="display:none;"></div>

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
    const cardApp = {
        metrics: Array.isArray(currentState.card_metrics) ? [...currentState.card_metrics] : [],
        data: window.reportMetrics || {},
        container: null,
        loader: null,
        init() {
            this.container = document.getElementById('metric-cards');
            this.loader = document.getElementById('cards-loading');
            window.addEventListener('metricsChanged', (e) => {
                this.metrics = e.detail || [];
                this.render();
            });
            window.addEventListener('reportDataUpdated', (e) => {
                this.data = e.detail || {};
                this.render();
            });
            window.addEventListener('reportDataLoading', () => {
                this.showLoader();
            });
            this.render();
        },
        showLoader() {
            if (this.loader) this.loader.style.display = 'block';
            if (this.container) this.container.style.display = 'none';
        },
        getValue(slug) {
            const group = Object.keys(this.data)[0];
            if (!group || !this.data[group]) return '-';
            const val = this.data[group][slug];
            return val !== undefined ? val : '-';
        },
        render() {
            if (!this.container) return;
            this.container.innerHTML = '';
            const group = Object.keys(this.data)[0];
            if (!group) {
                this.showLoader();
                return;
            }
            if (this.loader) this.loader.style.display = 'none';
            this.container.style.display = 'flex';
            this.metrics.forEach(id => {
                const info = window.metricStore.getById(Number(id));
                if (!info) return;
                const slug = info.slug || (info.name ? info.name.toLowerCase().replace(/\s+/g, '_') : '');
                const value = this.getValue(slug);
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-3';
                col.innerHTML = `<div class="card-item"><div class="card-name">${info.name}</div><div class="card-value" data-slug="${slug}">${value}</div></div>`;
                this.container.appendChild(col);
            });
        }
    };
    cardApp.init();
    window.cardApp = cardApp;
});
</script>
