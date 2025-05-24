<?php if (!empty($modalMessage)): ?>
<div id="globalModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 text-center shadow-lg">
    <h2 class="text-xl font-bold text-red-600 mb-2">Notice</h2>
    <p class="text-gray-700"><?= htmlspecialchars($modalMessage) ?></p>
    <button onclick="document.getElementById('globalModal').style.display='none'"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Close
    </button>
  </div>
</div>
<?php endif; ?>
