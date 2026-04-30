const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Detection {
  bbox: number[];
  confidence: number;
  label: string;
  source?: string;
}

export interface ArchitectureResult {
  canopy_density_percent: number;
  branch_complexity_score: number;
  structural_score: number;
  status: string;
}

export interface AIInsights {
  source: string;
  fruit_count: number;
  ripeness_summary: string;
  observations: string;
  health_notes: string;
  growth_stage: string;
  confidence: string;
}

export interface AnalysisResult {
  total_fruits: number;
  ripe: number;
  semi_ripe: number;
  unripe: number;
  estimated_yield_kg: number;
  architecture: ArchitectureResult;
  detections: Detection[];
  nutrient_management: string;
  analysis_source: string;
  harvest_timeline: {
    ripe: string;
    semi_ripe: string;
    unripe: string;
  };
  ai_insights: AIInsights | null;
}

export async function analyzeImage(
  file: File,
  growthRetardant: string = "none",
  trainingSystem: string = "standard",
  canopyDensity: string = "moderate",
  nutrientManagement: string = "standard"
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("growth_retardant", growthRetardant);
  formData.append("training_system", trainingSystem);
  formData.append("canopy_density", canopyDensity);
  formData.append("nutrient_management", nutrientManagement);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Analysis failed");
  }

  return data as AnalysisResult;
}
