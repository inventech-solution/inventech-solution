<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php"); // Redirect to login page
    exit();
}
require_once __DIR__ . "/backend/controllers/DashboardController.php"; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/inventech-solution/assets/js/fetch-metrics-from-db.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script><!-- Alpine.js (for x-data, x-show, @click) -->
    <link rel="stylesheet" href="https://cdn.hugeicons.com/font/hgi-stroke-rounded.css" />
    <style>
        .hgi{
            color: #00E677;
            font-size: 24px;
            font-weight: 100!important;
        }
        .folder-title{
            position: relative;
            min-height: 32px;
            border-radius: 6px;
            padding: 0px 4px;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            gap: 4px;
            list-style-type: none;
            -webkit-font-smoothing: antialiased;
            font-family: Inter, sans-serif;
            font-size: 14px;
            line-height: 20px;
            color: var(--mds-color-gray-11);
            outline: none;
            border: none;
            cursor: pointer;
            background-color: unset;
            transition-property: background-color;
            transition-duration: 75ms;
            transition-timing-function: ease-in-out;
            width: 100%;
            gap: 8px;
            color: var(--mds-color-gray-12);
            padding-right: 4px;
        }
        .folder-title span img{
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            display: inline-flex
        }
        .folder-title strong{
            font-size: 14px;
            line-height: 20px;
        }
    </style>
    <script>
        function toggleReports(element) {
            const reportList = element.nextElementSibling;
            const icon = element.querySelector('.folder-toggler');

            if (reportList.style.display === 'none') {
                reportList.style.display = 'block';
                icon.style.transform = 'rotate(90deg)'; // Pointing down
            } else {
                reportList.style.display = 'none';
                icon.style.transform = 'rotate(0deg)'; // Pointing right
            }
        }
    </script>
</head>
<!--
Soft Colors: #B8E2D2 (a gentle mint green)
Sage Green:  #98FB98 
Moss Green: #8FBC8F
Aqua: #00FFFF
Teal: #008080


    -->
<body style="background-color: #F8FBFF;">

    <div x-data="{ sidebarOpen: true, active: window.location.pathname, showFolderModal: false, folderName: '', contextMenuFolderId: null,}" class="flex h-screen" @click.away="showContextMenu=false">

        <!-- Sidebar -->
        <aside :class="sidebarOpen ? 'w-64' : 'w-20'" 
            class="transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style="border-right: 1px solid #e2e2e2; background-color: #fff;"><?php //background-color: #f8f8f8; ?>

            <!-- Top Section -->
            <div>
                <!-- Logo -->
                <div class="flex items-center justify-between p-4">
                    <img src="/inventech-solution/assets/images/logo/AdsInsight-ai.png" alt="Logo" class="h-6" x-show="sidebarOpen">
                    <button @click="sidebarOpen = !sidebarOpen" class="focus:outline-none">
                        <i class="hgi hgi-stroke hgi-sidebar-left text-xl"></i>
                    </button>
                </div>
                <div class="pt-3 pb-3 border-b border-gray-200 border-t border-gray-200">
                    <div class="px-3 py-2 font-semibold flex items-center justify-between cursor-pointer">
                        <div class="flex items-center space-x-2">
                            <i class="hgi hgi-stroke hgi-home-01 text-xl"></i>
                            <span x-show="sidebarOpen" class="text-sm">Dashboard</span>
                        </div>
                    </div>
                    <div class="px-3 py-2 font-semibold flex items-center justify-between cursor-pointer">
                        <div class="flex items-center space-x-2">
                            <i class="hgi hgi-stroke hgi-play-list-add text-xl"></i>
                            <span x-show="sidebarOpen" class="text-sm">Create Report</span>
                        </div>
                    </div>
                </div>
                <!-- Dynamic PHP folders -->
                <?php
                $controller = new DashboardController($conn);
                $folders = $controller->loadFoldersAndReports($_SESSION['user']['id']);
                ?>

                <?php if (empty($folders)): ?>
                <p class="px-4 text-sm text-gray-500">No folders or reports found.</p>
                <?php else: ?>
                <?php foreach ($folders as $index => $folder): $folderId = $folder['folder_name']?>
                    <div x-data="{ folderOpen: true }">
                    <!-- Folder Header -->
                    <div class="px-3 py-2 font-semibold flex items-center justify-between cursor-pointer relative"
                    @contextmenu.prevent="contextMenuFolderId = <?= $folderId ?>;"
         @click="folderOpen = !folderOpen"
         @click.away="contextMenuFolderId = null">
                        <div class="flex items-center space-x-2">
                            <i class="hgi hgi-stroke hgi-folder-01 text-xl"></i>
                            <span x-show="sidebarOpen" class="text-sm"><?= htmlspecialchars($folder['folder_name']) ?></span>
                        </div>
                        <div x-show="sidebarOpen">
                            <i x-show="!folderOpen" class="hgi hgi-stroke hgi-arrow-down-01"></i>
                            <i x-show="folderOpen" class="hgi hgi-stroke hgi-arrow-up-01"></i>
                        </div>
                    </div>

                    <!-- Folder Reports -->
                    <div x-show="folderOpen" class="space-y-1 pl-6">
                        <?php if (empty($folder['reports'])): ?>
                        <div class="text-sm text-gray-400 px-4">No reports in this folder.</div>
                        <?php else: ?>
                        <?php foreach ($folder['reports'] as $report): ?>
                            <a href="/inventech-solution/reports/?rid=<?= $report['uid'] ?>" class="flex items-center px-2 py-2 hover:bg-gray-200 rounded transition-all">
                                <i class="hgi hgi-stroke hgi-analytics-up text-xl"></i>
                                <span x-show="sidebarOpen" class="ml-1 text-sm"><?= htmlspecialchars($report['title']) ?></span>
                            </a>
                        <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    </div>
                <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Bottom Section -->
            <div class="p-3">
                <button class="w-full hover:bg-gray-200 flex items-center px-2 py-2 rounded transition-all duration-150 ease-in-out cursor-pointer"  @click="showFolderModal = true">
                    <i class="hgi hgi-stroke hgi-folder-add text-xl"></i>
                    <span x-show="sidebarOpen" class="ml-3">New Folder</span>
                </button>
                <template x-for="item in [
                { name: 'Settings', path: '/inventech-solution/settings', icon: 'hgi-configuration-02' },
                { name: 'Logout', path: '/inventech-solution/logout.php', icon: 'hgi-logout-03' }
                ]" :key="item.path">
                    <div class="relative group">
                        <a @click.prevent="window.location.href = item.path"
                        :class="{
                            'bg-white text-black font-semibold': active === item.path,
                            'hover:bg-gray-200': true
                        }"
                        class="flex items-center px-2 py-2 rounded transition-all duration-150 ease-in-out cursor-pointer">
                        <i :class="`hgi hgi-stroke ${item.icon} text-xl`"></i>
                        <span x-show="sidebarOpen" class="ml-3" x-text="item.name"></span>
                        </a>

                        <!-- Tooltip -->
                        <div x-show="!sidebarOpen"
                            x-text="item.name"
                            class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        </div>
                    </div>
                </template>
            </div>
        </aside>
<!-- Folder Modal -->
<div x-show="showFolderModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md w-80">
      <h2 class="text-lg font-semibold mb-4">Add New Folder</h2>
      <input type="text" x-model="folderName" placeholder="Folder Name"
             class="w-full p-2 border border-gray-300 rounded mb-4">
      <div class="flex justify-end space-x-2">
        <button @click="showFolderModal = false"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="
          fetch('/api/folders/add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: folderName })
          })
          .then(res => res.json())
          .then(data => {
            if(data.success) location.reload();
          });
        "
        class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Add</button>
      </div>
    </div>
  </div>

        <!-- Main Content -->
        <main class="flex-1 p-6 overflow-y-auto">
        





<?php
require_once( __DIR__ . '/libs/facebook-sdk/src/Facebook/autoload.php');

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

$config = require_once(__DIR__ . '/libs/facebookConfig.php');

$fb = new Facebook([
    'app_id' => $config['app_id'],
    'app_secret' => $config['app_secret'],
    'default_graph_version' => 'v3.2', // Make sure to set a default version
    'default_access_token' => $config['access_token'],
]);
?>

        

    
