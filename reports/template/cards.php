
<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('cardApp', () => ({
        metrics: [], // now array of metric names
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
            if (typeof name !== 'string') return '';
            const paren = name.match(/\(([^)]+)\)$/);
            if (paren) return paren[1].toLowerCase();
            return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        },

        getValue(metrics, slug) {
            const value = metrics?.[slug] ?? metrics?.[slug.toLowerCase()] ?? metrics?.[slug.replace(/_/g, '')];
            if (value === undefined || value === null) return '-';
            if (!isNaN(value) && typeof value !== 'object') {
                const num = parseFloat(value);
                return Number.isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value;
            }
            return value;
        }
    }));
});
</script>

<!-- Rich Tile-Based Ad Cards -->
<div x-data="cardApp" x-show="ready" x-cloak>
  <div class="grid-container">
    <template x-for="(groupData, groupName) in data" :key="groupName">
      <div class="ad-card">
        <div class="ad-preview">
          <template x-if="groupData.meta?.videoUrl">
            <video x-bind:src="groupData.meta.videoUrl" controls muted playsinline></video>
          </template>
          <template x-if="!groupData.meta?.videoUrl && groupData.meta?.thumbnail">
            <img x-bind:src="groupData.meta.thumbnail" alt="thumbnail" />
          </template>
          <template x-if="!groupData.meta?.thumbnail && !groupData.meta?.videoUrl">
            <div class="placeholder">No Preview</div>
          </template>
        </div>
        <div class="ad-info">
          <div class="ad-label" x-text="groupName"></div>
          <div class="ad-cta" x-text="groupData.meta?.cta || ''"></div>
        </div>
        <div class="ad-metrics">
          <template x-for="name in metrics" :key="name">
            <div class="metric-block">
              <div class="metric-name" x-text="name"></div>
              <div class="metric-value" x-text="getValue(groupData.metrics, slugify(name))"></div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</div>

<style>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.ad-card {
  flex: 1 0 240px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
}
.ad-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ad-preview video,
.ad-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  font-size: 0.875rem;
  color: #9ca3af;
}
.ad-info {
  padding: 0.5rem 1rem 0 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4b5563;
}
.ad-label {
  font-weight: 600;
}
.ad-cta {
  font-style: italic;
  text-transform: capitalize;
}
.ad-metrics {
  padding: 0 1rem;
  margin-top: 0.5rem;
}
.metric-block {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 0.25rem 0;
}
.metric-name {
  color: #6b7280;
}
.metric-value {
  font-weight: 600;
  color: #111827;
}
</style>
