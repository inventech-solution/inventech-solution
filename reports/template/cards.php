<div id="metric-cards" class="row" x-data="cardApp" x-show="ready" x-cloak>
    <template x-for="id in metrics" :key="id">
        <div class="col-md-4 mb-3">
            <div class="card-item">
                <div class="card-name" x-text="metricName(id)"></div>
                <div class="card-value" :data-slug="metricSlug(id)" x-text="getValue(metricSlug(id))"></div>
            </div>
        </div>
    </template>
</div>

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
document.addEventListener('alpine:init', () => {
    Alpine.data('cardApp', () => ({
        metrics: [],
        data: {},
        ready: false,

        init() {
           const setMetrics = () => {
                this.metrics = Array.isArray(currentState.card_metrics)
                    ? [...currentState.card_metrics] : [];
            };

            if (window.metricStore.loaded) {
                setMetrics();
            } else {
                window.metricStore.load().then(setMetrics);
            }

            window.addEventListener('reportDataUpdated', e => {
                this.data = e.detail || {};
                if (!this.ready) {
                    setMetrics();
                    this.ready = true;
                }
            });
            window.addEventListener('metricsChanged', e => {
                this.metrics = e.detail || [];
            });
        },

        slugify(name) {
            if (!name) return '';
            const paren = name.match(/\(([^)]+)\)$/);
            if (paren) return paren[1].toLowerCase();
            return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        },

        metricInfo(id) {
            return window.metricStore.getById(Number(id));
        },

        metricName(id) {
            const info = this.metricInfo(id);
            return info ? info.name : '';
        },

         metricSlug(id) {
            const info = this.metricInfo(id);
            if (!info) return '';
            return (
                info.apiName ||
                info.api_name ||
                info.slug ||
                this.slugify(info.name || '')
            );
        },

        getValue(slug) {
            const group = Object.keys(this.data)[0];
            if (!group || !this.data[group]) return '-';
            const val = this.data[group][slug];
            return val !== undefined ? val : '-';
        }
    }));
});
</script>
