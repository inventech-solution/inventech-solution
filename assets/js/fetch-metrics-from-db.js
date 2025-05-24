// metrics.js (shared reusable file)
// This file fetesches metrics from the database and stores them in a global object.
// Call this file from HTML using <script src="/path/to/metrics.js"></script>

window.metricStore = {
    all: [],
    loaded: false,

    load: function () {
        return $.ajax({
            url: '../../backend/controllers/FetchMetricsFromDB.php',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.all = data;
                this.loaded = true;
            },
            error: (err) => {
                console.error("Failed to load metrics:", err);
            }
        });
    },

    getById: function (id) {
        return  this.all.find(m => m.id === id);
    }
};