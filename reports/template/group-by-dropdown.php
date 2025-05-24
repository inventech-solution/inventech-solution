<!--DropDown-->
<div class="relative inline-block" x-data="{ open: false, selectedOption: '<?= htmlspecialchars($selectedGroupBy) ?>' }" x-effect="
    if (selectedOption !== initialState.groupBy) {
        currentState.groupBy = selectedOption;
        unsavedChanges = true;
    } else {
        currentState.groupBy = initialState.groupBy;
    }
">
    <div class="bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm cursor-pointer flex items-center justify-between w-full"
         @click="open = !open"
         @keydown.enter="open = !open"
         aria-haspopup="true"
         aria-expanded="false"
         id="dropdown-trigger"
    >
        <span class="font-medium">Group by&nbsp;&nbsp;</span>
        <span x-text="selectedOption">Group by</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-3 text-gray pointer-events-none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    </div>

    <div class="absolute z-10 mt-2 w-full bg-white rounded-md border border-gray-200"
         x-show="open"
         x-transition:enter="transition ease-out duration-100"
         x-transition:enter-start="transform opacity-0 scale-95"
         x-transition:enter-end="transform opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-75"
         x-transition:leave-start="transform opacity-100 scale-100"
         x-transition:leave-end="transform opacity-0 scale-95"
         role="menu"
         aria-orientation="vertical"
         aria-labelledby="dropdown-trigger"
         style="display: none; min-width: 200px;"
    >
        <div class="py-1" role="none">
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Ad Name'; open = false"
               @keydown.enter="selectedOption = 'Ad Name'; open = false"
            >
                Ad Name
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Creative'; open = false"
               @keydown.enter="selectedOption = 'Creative'; open = false"
            >
                Creative
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Copy'; open = false"
               @keydown.enter="selectedOption = 'Copy'; open = false"
            >
                Copy
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Headline'; open = false"
               @keydown.enter="selectedOption = 'Headline'; open = false"
            >
                Headline
            </a>
             <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Landing Page'; open = false"
               @keydown.enter="selectedOption = 'Landing Page'; open = false"
            >
                Landing Page
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'CTA Button'; open = false"
               @keydown.enter="selectedOption = 'CTA Button'; open = false"
            >
                CTA Button
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Discount Code'; open = false"
               @keydown.enter="selectedOption = 'Discount Code'; open = false"
            >
                Discount Code
            </a>
            <a href="#"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
               @click.prevent="selectedOption = 'Post ID'; open = false"
               @keydown.enter="selectedOption = 'Post ID'; open = false"
            >
                Post ID
            </a>
        </div>
    </div>
    <input type="hidden" name="group_by" x-bind:value="selectedOption">
</div>
<!--End DropDown-->