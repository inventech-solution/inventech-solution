<?php
class Metrics {
    public static function spend(array $ads): float {
        $total = 0;
        foreach ($ads as $ad) {
            $insight = $ad['insights'][0] ?? [];
            $total += (float)($insight['spend'] ?? 0);
        }
        return $total;
    }

    public static function impressions(array $ads): int {
        $total = 0;
        foreach ($ads as $ad) {
            $insight = $ad['insights'][0] ?? [];
            $total += (int)($insight['impressions'] ?? 0);
        }
        return $total;
    }

    public static function clicks(array $ads): int {
        $total = 0;
        foreach ($ads as $ad) {
            $insight = $ad['insights'][0] ?? [];
            $total += (int)($insight['clicks'] ?? 0);
        }
        return $total;
    }

    public static function ctr(array $ads): string {
        $impressions = self::impressions($ads);
        $clicks = self::clicks($ads);
        return $impressions > 0 ? number_format(($clicks / $impressions) * 100, 2) : '0.00';
    }

    public static function purchase_roas(array $ads): string {
        $spend = self::spend($ads);
        $value = 0;
        foreach ($ads as $ad) {
            $insight = $ad['insights'][0] ?? [];
            if (!empty($insight['action_values'])) {
                foreach ($insight['action_values'] as $action) {
                    if (($action['action_type'] ?? '') === 'purchase') {
                        $value += (float)($action['value'] ?? 0);
                    }
                }
            }
        }
        return $spend > 0 ? number_format($value / $spend, 2) : '0.00';
    }
}
?>
