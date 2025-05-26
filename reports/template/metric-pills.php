<!-- Metric Pills Component -->
<div class="bg-white p-4 rounded-xl shadow-sm mb-6 row"  style="border: 1px solid #e2e2e2;">
    <div class="col-md-10">
        <div class="flex items-center gap-3 flex-wrap" x-data="metricPills" x-init="init()" >
            <!-- Selected metric pills -->
            <template x-for="(metric, index) in selectedMetrics" :key="metric.id">
                <div 
                    class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full shadow-sm cursor-move"
                    :style="`background-color: ${color(index)};`" 
                    draggable="true"
                    @dragstart="dragStart(index)"
                    @dragover.prevent
                    @drop="drop(index)"
                >
                    <span class="font-medium text-white" x-text="index + 1"></span>
                    <span class="text-white" x-text="metric.name"></span>
                    <button @click="removeMetric(metric.id)" class="text-white ml-1">&times;</button>
                </div>
            </template>

            <!-- Add Metric Dropdown -->
            <div class="relative" x-data="{ open: false, search: '' }" @click.outside="open = false">
                <button @click="open = !open" class="text-sm text-aqua-600 hover:underline">
                    + Add metric
                </button>
                <div x-show="open" class="absolute z-10 mt-2 w-64 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded shadow text-sm p-2"
                    x-transition>
                    <input type="text" id="metricPillDropdownSearhbox" placeholder="Search..." x-model="search"
                        class="w-full border px-2 py-1 rounded mb-2 text-sm" />

                    <template x-for="metric in filteredMetrics" :key="metric.id">
                        <div @click="addMetric(metric)" 
                            class="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded relative group">
                            <span x-text="metric.name"></span>
                            <div class="absolute left-full ml-2 w-48 hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 z-20">
                                <strong x-text="metric.description"></strong><br>
                                <em x-text="metric.formula"></em>
                            </div>
                        </div>
                    </template>

                    <template x-if="filteredMetrics.length === 0">
                        <div class="text-gray-400 text-xs text-center">No metrics available</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-2" style="text-align: right;">
        <button @click="activeTab = 'section1'" 
                :class="activeTab === 'section1' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'"
                class="border border-gray-300 rounded-md px-2 pb-1 pt-2 text-sm" style="border-top-right-radius: 0; border-bottom-right-radius: 0; vertical-align: middle;margin-right:-2px;">
            <i class="hgi hgi-stroke hgi-school-report-card"></i>
        </button>
        <button @click="activeTab = 'section2'" 
                :class="activeTab === 'section2' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'"
                class="border border-gray-300 rounded-md px-2 pb-1 pt-2 text-sm" style="border-top-left-radius: 0; border-bottom-left-radius: 0; vertical-align: middle;margin-left:-2px;">
            <i class="hgi hgi-stroke hgi-chart-line-data-02"></i>
        </button>
    </div>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('metricPills', () => {
        return {
            selectedIds: [],
            selectedMetrics: [],
            dragIndex: null,
            search: '',

            init() {
                const raw = <?php echo json_encode($card_metrics_json ?? []); ?>;
                this.selectedIds = Array.isArray(raw) ? raw.map(Number) : (typeof raw === 'string' ? JSON.parse(raw).map(Number) : []);

                if (window.metricStore.loaded) {
                    this.populateSelected();
                } else {
                    window.metricStore.load().then(() => {
                        this.populateSelected();
                    });
                }
            },

            get filteredMetrics() {
                const search = this.search.trim().toLowerCase();
                let availableMetrics = window.metricStore.all.filter(m => !this.selectedIds.includes(Number(m.id)));

                if (search !== '') {
                    availableMetrics = availableMetrics.filter(m => m.name.toLowerCase().includes(search));
                }

                return availableMetrics;
            },

            populateSelected() {
                this.selectedMetrics = this.selectedIds
                    .map(id => {
                        const metric = window.metricStore.all.find(m => Number(m.id) === Number(id));
                        return metric;
                    })
                    .filter(Boolean);
                    initialState.card_metrics = [...this.selectedIds];
                    currentState.card_metrics = initialState.card_metrics;
            },

            addMetric(metric) {
                if (this.selectedMetrics.some(m => m.id === metric.id)) return;
                this.selectedMetrics.push(metric);
                this.updateSelected();
            },

            removeMetric(id) {
                this.selectedMetrics = this.selectedMetrics.filter(m => m.id !== id);
                this.updateSelected();
            },

            updateSelected() {
                this.selectedIds = this.selectedMetrics.map(m => m.id);
                currentState.card_metrics = [...this.selectedIds];
                unsavedChanges = true;
                window.dispatchEvent(new CustomEvent('metricsChanged', { detail: this.selectedIds }));
            },

            dragStart(index) {
                this.dragIndex = index;
            },

            drop(index) {
                const moved = this.selectedMetrics.splice(this.dragIndex, 1)[0];
                this.selectedMetrics.splice(index, 0, moved);
                this.updateSelected();
            },

            color(i) {
                const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#6366f1', '#ef4444'];
                return colors[i % colors.length];
            }
        }
    });
});
</script>
