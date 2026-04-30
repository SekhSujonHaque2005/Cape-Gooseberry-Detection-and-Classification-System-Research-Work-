class YieldEstimator:
    def __init__(self):
        # Scientific Decision Weights (in kg)
        self.weight_per_fruit = {
            "ripe": 0.01,        # 10g
            "semi_ripe": 0.005,  # 5g
            "unripe": 0.002,     # 2g
            "other": 0.0
        }

        # Updated Growth Retardant Factors based on research
        self.growth_retardant_factors = {
            "none": 1.0,
            "CCC": 1.15,
            "Paclobutrazol": 1.40,
            "Uniconazole": 1.35,
            "Prohexadione Cl": 1.15,
            "Ethephon": 1.50
        }
        
        # Training system factors (Quality/Caliber boost)
        self.training_system_factors = {
            "standard": 1.0,
            "2-stem": 1.20,
            "4-stem": 1.10
        }

        # Occlusion Compensation (Canopy Density)
        self.occlusion_factors = {
            "sparse": 1.0,
            "moderate": 1.25,
            "dense": 1.50
        }

    def estimate(self, detections, growth_retardant="none", training_system="standard", canopy_density="moderate"):
        total_weight = 0

        for d in detections:
            label = d.get("label", "other")
            # Fixed weight based on scientific maturity stage
            total_weight += self.weight_per_fruit.get(label, 0.0)

        # Apply multipliers
        gr_mult = self.growth_retardant_factors.get(growth_retardant, 1.0)
        ts_mult = self.training_system_factors.get(training_system, 1.0)
        occ_mult = self.occlusion_factors.get(canopy_density, 1.0)
        
        final_yield = total_weight * gr_mult * ts_mult * occ_mult

        return round(final_yield, 3)
