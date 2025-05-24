<?php
$showModal = false;

if (!$reportId) {
    $showModal = true;
}
?>
<!-- Tailwind Modal -->
<div id="errorModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 <?php echo $showModal ? '' : 'hidden'; ?>">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 class="text-lg font-semibold text-red-600 mb-4">Error</h2>
        <p class="text-gray-700">Missing or invalid report. <br>Visit Dashboard and Open the report again.</p>
        <div class="mt-4 flex justify-end">
            <button onclick="document.getElementById('errorModal').classList.add('hidden')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Close
            </button>
        </div>
    </div>
</div>