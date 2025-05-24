            <div x-data="{ tooltipVisible: false, tooltipText: 'Refresh Data' }" class="relative inline-block mr-2" style="border: 1px solid #e2e2e2; border-radius: 0.375rem;">
                <button id="refreshData" class="group relative inline-flex items-center bg-white justify-center shadow-sm px-2 py-2 overflow-hidden font-mono text-sm font-semibold tracking-tight text-gray-800 rounded-md transition-all duration-300 hover:bg-aqua-50 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
                    @mouseover="tooltipVisible = true"
                    @mouseleave="tooltipVisible = false">
                    <span class="relative flex items-center">
                        <i class="hgi hgi-stroke hgi-arrow-reload-horizontal"></i>
                    </span>
                    <div class="absolute border-1 rounded-md pointer-events-none"></div>
                </button>

                <div
                    x-show="tooltipVisible"
                    class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md shadow-md"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0 translate-y-2"
                    x-transition:enter-end="opacity-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0"
                    x-transition:leave-end="opacity-0 translate-y-2"
                    style="display: none;">
                    <span x-text="tooltipText"></span>
                </div>
            </div>
            <div x-data="{ tooltipVisible: false, tooltipText: 'Save this Report' }" class="relative inline-block ml-2" style="border: 1px solid #e2e2e2; border-radius: 0.375rem;">
                <button id="saveData" class="group relative inline-flex items-center bg-white justify-center shadow-sm px-2 py-2 overflow-hidden font-mono text-sm font-semibold tracking-tight text-gray-800 rounded-md transition-all duration-300 hover:bg-aqua-50 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
                    @mouseover="tooltipVisible = true"
                    @mouseleave="tooltipVisible = false">
                    <span class="relative flex items-center">
                        <i class="hgi hgi-stroke hgi-floppy-disk"></i>
                    </span>
                    <div class="absolute border-1 rounded-md pointer-events-none"></div>
                </button>

                <div
                    x-show="tooltipVisible"
                    class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md shadow-md"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0 translate-y-2"
                    x-transition:enter-end="opacity-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0"
                    x-transition:leave-end="opacity-0 translate-y-2"
                    style="display: none;">
                    <span x-text="tooltipText"></span>
                </div>
            </div>
            <div x-data="{ tooltipVisible: false, tooltipText: 'Share this Report' }" class="relative inline-block ml-2" style="border: 1px solid #e2e2e2; border-radius: 0.375rem;">
                <button id="shareData" class="group relative inline-flex items-center bg-white justify-center shadow-sm px-2 py-2 overflow-hidden font-mono text-sm font-semibold tracking-tight text-gray-800 rounded-md transition-all duration-300 hover:bg-aqua-50 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
                    @mouseover="tooltipVisible = true"
                    @mouseleave="tooltipVisible = false">
                    <span class="relative flex items-center">
                        <i class="hgi hgi-stroke hgi-share-08"></i>
                    </span>
                    <div class="absolute border-1 rounded-md pointer-events-none"></div>
                </button>

                <div
                    x-show="tooltipVisible"
                    class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md shadow-md"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0 translate-y-2"
                    x-transition:enter-end="opacity-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0"
                    x-transition:leave-end="opacity-0 translate-y-2"
                    style="display: none;">
                    <span x-text="tooltipText"></span>
                </div>
            </div>
            <div x-data="{ tooltipVisible: false, tooltipText: 'Delete this Report' }" class="relative inline-block ml-2" style="border: 1px solid #e2e2e2; border-radius: 0.375rem;">
                <button id="deleteReport" class="group relative inline-flex items-center bg-white justify-center shadow-sm px-2 py-2 overflow-hidden font-mono text-sm font-semibold tracking-tight text-gray-800 rounded-md transition-all duration-300 hover:bg-aqua-50 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
                    @mouseover="tooltipVisible = true"
                    @mouseleave="tooltipVisible = false">
                    <span class="relative flex items-center">
                        <i class="hgi hgi-stroke hgi-delete-02 text-red"></i>
                    </span>
                    <div class="absolute border-1 rounded-md pointer-events-none"></div>
                </button>

                <div
                    x-show="tooltipVisible"
                    class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md shadow-md"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0 translate-y-2"
                    x-transition:enter-end="opacity-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0"
                    x-transition:leave-end="opacity-0 translate-y-2"
                    style="display: none;">
                    <span x-text="tooltipText"></span>
                </div>
            </div>

            <script>
$(document).ready(function () {

    // Refresh button click event
    $('#refreshData').on('click', function () {
        // Add your refresh logic here
        //alert('Refresh clicked!');
    });

    // Save button click event
    $('#saveData').on('click', function () {
        // Add your save logic here
        //alert('Save clicked!');
    });

    // Share button click event
    $('#shareData').on('click', function () {
        // Add your save logic here
        //alert('Share clicked!');
    });

    // Delete button click event
    $('#deleteReport').on('click', function () {
        // Add your save logic here
        //alert('Delete clicked!');
    });
});
</script>