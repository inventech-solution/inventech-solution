
            <!-- Add Folder Modal -->
            <div id="addFolderModal" class="modal fade" role="dialog">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addFolderModalLabel">Add New Folder</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text" id="folderName" name="folderName" class="form-control" placeholder="Folder Name">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="addFolder()">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <footer class="bg-white shadow-md p-4 text-center text-gray-600 mt-auto">
        <p>&copy; <?php echo date("Y"); ?> Your SaaS Platform. All rights reserved.</p>
    </footer>
    <script>
        function addFolder() {
            const folderName = document.getElementById('folderName').value;
            fetch('/backend/controllers/DashboardController.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: folderName })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                location.reload();
                } else {
                alert('Failed to add folder.');
                }
            });
        }
        function toggleSidebar() {
            const sidebar = document.querySelector("aside");
            sidebar.classList.toggle("hidden");
        }
    </script>
    
</body>
</html>