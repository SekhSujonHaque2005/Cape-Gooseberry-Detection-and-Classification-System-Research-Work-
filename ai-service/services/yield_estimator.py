class YieldEstimator:
    def __init__(self):
        self.ripeness_factor = {
            "ripe": 1.0,
            "semi_ripe": 0.7,
            "unripe": 0.4,
            "other": 0.0
        }

        self.scaling_constant = 0.00005
        
        # New treatment multipliers (based on literature for Cape Gooseberry)
        self.growth_retardant_factors = {
            "none": 1.0,
            "CCC": 1.15,      # Cycocel often increases fruit set
            "Paclobutrazol": 1.25 # PBZ is known to significantly boost yield
        }
        
        self.training_system_factors = {
            "standard": 1.0,
            "2-stem": 1.1,
            "4-stem": 1.2
        }

    def estimate(self, detections, growth_retardant="none", training_system="standard"):
        total = 0

        for d in detections:
            x1, y1, x2, y2 = d["bbox"]
            label = d["label"]

            area = (x2 - x1) * (y2 - y1)
            total += area * self.ripeness_factor.get(label, 0.0)

        # Apply treatment multipliers
        gr_mult = self.growth_retardant_factors.get(growth_retardant, 1.0)
        ts_mult = self.training_system_factors.get(training_system, 1.0)
        
        raw_yield = total * self.scaling_constant
        adjusted_yield = raw_yield * gr_mult * ts_mult

        return round(adjusted_yield, 2)
