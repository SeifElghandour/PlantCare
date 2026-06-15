const diseases = [
  // --- Apple ---
  {
    name: "Apple___Apple_scab",
    symptoms: "Dark, olive-colored fungal spots on leaves and fruit.",
    treatment: "Apply copper-based sprays or safe fungicides like Mancozeb.",
    prevention: "Prune trees to improve air circulation and remove fallen infected leaves."
  },
  {
    name: "Apple___Black_rot",
    symptoms: "Purple spots on leaves and rotting fruit with concentric rings.",
    treatment: "Use copper-based fungicides.",
    prevention: "Remove dead wood, cankers, and mummified fruit from the tree."
  },
  {
    name: "Apple___Cedar_apple_rust",
    symptoms: "Bright orange or yellow spots on the upper leaf surface.",
    treatment: "Apply safe fungicides such as Mancozeb.",
    prevention: "Plant resistant varieties and remove nearby juniper/cedar trees if possible."
  },
  {
    name: "Apple___healthy",
    symptoms: "No disease detected. Leaves appear green, vibrant, and free of spots.",
    treatment: "None required. The plant is in good health.",
    prevention: "Maintain regular watering, proper fertilization, and monitor for pests."
  },

  // --- Blueberry ---
  {
    name: "Blueberry___healthy",
    symptoms: "Healthy green foliage with no signs of fungal or bacterial growth.",
    treatment: "None required.",
    prevention: "Ensure acidic soil pH and consistent moisture levels."
  },

  // --- Cherry ---
  {
    name: "Cherry_(including_sour)___Powdery_mildew",
    symptoms: "White, powdery fungal coating on leaves and young stems.",
    treatment: "Use sulfur-based sprays or safe fungicides.",
    prevention: "Avoid excessive humidity and ensure proper spacing between trees."
  },
  {
    name: "Cherry_(including_sour)___healthy",
    symptoms: "Normal leaf growth with no powdery residue or spotting.",
    treatment: "None required.",
    prevention: "Prune regularly to maintain airflow within the canopy."
  },

  // --- Corn ---
  {
    name: "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    symptoms: "Rectangular grey to brown lesions that run parallel to leaf veins.",
    treatment: "Use safe fungicides like Mancozeb.",
    prevention: "Improve field drainage and use resistant corn varieties."
  },
  {
    name: "Corn_(maize)___Common_rust_",
    symptoms: "Cinnamon-brown pustules appearing on both leaf surfaces.",
    treatment: "Apply safe fungicides like Mancozeb.",
    prevention: "Plant resistant hybrids and clear plant debris after harvest."
  },
  {
    name: "Corn_(maize)___Northern_Leaf_Blight",
    symptoms: "Large, cigar-shaped grey-green lesions on leaves.",
    treatment: "Apply Mancozeb or recommended fungicides.",
    prevention: "Practice crop rotation and manage agricultural residues."
  },
  {
    name: "Corn_(maize)___healthy",
    symptoms: "Strong green leaves with no visible pustules or lesions.",
    treatment: "None required.",
    prevention: "Practice crop rotation and maintain soil nutrient levels."
  },

  // --- Grape ---
  {
    name: "Grape___Black_rot",
    symptoms: "Small brown spots on leaves and shriveled black berries.",
    treatment: "Apply copper-based fungicides.",
    prevention: "Remove infected branches and reduce humidity around the vines."
  },
  {
    name: "Grape___Esca_(Black_Measles)",
    symptoms: "Interveinal tiger-stripe yellowing on leaves and wood decay.",
    treatment: "Prune affected areas and apply copper-based protection.",
    prevention: "Sanitize pruning tools and manage vine stress."
  },
  {
    name: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    symptoms: "Irregular brown spots that cause leaves to wither.",
    treatment: "Apply copper sprays.",
    prevention: "Manage canopy density to improve airflow."
  },
  {
    name: "Grape___healthy",
    symptoms: "Vibrant green leaves without tiger-striping or spotting.",
    treatment: "None required.",
    prevention: "Regularly inspect vines and ensure proper support structures."
  },

  // --- Orange ---
  {
    name: "Orange___Haunglongbing_(Citrus_greening)",
    symptoms: "Yellowing of leaf veins and blotchy mottling. Small, lopsided fruit.",
    treatment: "No known cure. Infected trees must be removed to prevent spread.",
    prevention: "Control Asian citrus psyllid insects and use disease-free nursery stock."
  },

  // --- Peach ---
  {
    name: "Peach___Bacterial_spot",
    symptoms: "Small, water-soaked spots on leaves that turn brown or black.",
    treatment: "Apply copper-based sprays.",
    prevention: "Avoid overhead irrigation and remove infected leaves."
  },
  {
    name: "Peach___healthy",
    symptoms: "Leaves are smooth, green, and show no signs of bacterial lesions.",
    treatment: "None required.",
    prevention: "Apply preventative dormant sprays and ensure good soil drainage."
  },

  // --- Pepper Bell ---
  {
    name: "Pepper,_bell___Bacterial_spot",
    symptoms: "Small, irregular lesions on leaves and fruit.",
    treatment: "Apply copper sprays.",
    prevention: "Ensure adequate ventilation and remove infected plant parts."
  },
  {
    name: "Pepper,_bell___healthy",
    symptoms: "Healthy, glossy green leaves with no spotting.",
    treatment: "None required.",
    prevention: "Maintain consistent soil moisture and avoid handling wet plants."
  },

  // --- Potato ---
  {
    name: "Potato___Early_blight",
    symptoms: "Dark spots with concentric rings appearing on older leaves.",
    treatment: "Use safe fungicides like Mancozeb.",
    prevention: "Control humidity levels and plant resistant varieties."
  },
  {
    name: "Potato___Late_blight",
    symptoms: "Water-soaked dark lesions on leaf tips and stems.",
    treatment: "Apply Mancozeb or copper-based fungicides.",
    prevention: "Plant certified seeds and ensure proper air circulation."
  },
  {
    name: "Potato___healthy",
    symptoms: "Sturdy green foliage with no dark lesions or wilting.",
    treatment: "None required.",
    prevention: "Hilling plants and ensuring good crop rotation practices."
  },

  // --- Raspberry ---
  {
    name: "Raspberry___healthy",
    symptoms: "Deep green leaves with typical serrated edges and no discoloration.",
    treatment: "None required.",
    prevention: "Prune old canes after harvest to encourage healthy new growth."
  },

  // --- Soybean ---
  {
    name: "Soybean___healthy",
    symptoms: "Clean green leaves with no signs of rust or blight.",
    treatment: "None required.",
    prevention: "Monitor for aphids and maintain soil health."
  },

  // --- Squash ---
  {
    name: "Squash___Powdery_mildew",
    symptoms: "White, dusty fungal spots that look like flour on the leaves.",
    treatment: "Apply sulfur-based fungicides or neem oil.",
    prevention: "Increase sunlight exposure and avoid overcrowding plants."
  },

  // --- Strawberry ---
  {
    name: "Strawberry___Leaf_scorch",
    symptoms: "Purple spots that eventually turn brown and dry out the leaf.",
    treatment: "Apply copper sprays or bio-fungicides.",
    prevention: "Improve ventilation, use drip irrigation, and remove infected foliage."
  },
  {
    name: "Strawberry___healthy",
    symptoms: "Low-growing vibrant green leaves without purple or brown spotting.",
    treatment: "None required.",
    prevention: "Mulch with straw to keep berries and leaves off the soil."
  },

  // --- Tomato ---
  {
    name: "Tomato___Bacterial_spot",
    symptoms: "Small, water-soaked, greasy-looking spots on leaves.",
    treatment: "Apply copper-based sprays.",
    prevention: "Use disease-free seeds and avoid overhead watering."
  },
  {
    name: "Tomato___Early_blight",
    symptoms: "Brown spots with 'target' concentric rings on leaves.",
    treatment: "Apply Mancozeb or copper sprays; remove infected leaves.",
    prevention: "Prune lower branches and avoid overhead watering."
  },
  {
    name: "Tomato___Late_blight",
    symptoms: "Dark, water-soaked spots on leaves and stems; rapid wilting.",
    treatment: "Apply copper-based fungicide or use Mancozeb.",
    prevention: "Water at the base and improve air circulation."
  },
  {
    name: "Tomato___Leaf_Mold",
    symptoms: "Pale green or yellow spots with a velvet-like fungal coating.",
    treatment: "Apply copper-based fungicides.",
    prevention: "Increase greenhouse ventilation and reduce humidity."
  },
  {
    name: "Tomato___Septoria_leaf_spot",
    symptoms: "Circular spots with dark borders and grey centers.",
    treatment: "Apply copper sprays or Mancozeb.",
    prevention: "Remove infected lower leaves and manage weeds."
  },
  {
    name: "Tomato___Spider_mites Two-spotted_spider_mite",
    symptoms: "Yellow stippling on leaves and fine webbing on undersides.",
    treatment: "Apply Neem oil or agricultural soap.",
    prevention: "Keep plants well-hydrated and maintain moderate humidity."
  },
  {
    name: "Tomato___Target_Spot",
    symptoms: "Small, water-soaked spots that develop into target-like lesions.",
    treatment: "Use copper sprays.",
    prevention: "Maintain proper plant spacing for better airflow."
  },
  {
    name: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    symptoms: "Yellow margins and upward curling of leaves; stunted growth.",
    treatment: "No direct cure for the virus.",
    prevention: "Immediately remove infected plants and control Whitefly insects."
  },
  {
    name: "Tomato___Tomato_mosaic_virus",
    symptoms: "Mottled green and yellow patterns on leaves.",
    treatment: "No direct cure exists for the mosaic virus.",
    prevention: "Practice strict sanitation and remove infected plants immediately."
  },
  {
    name: "Tomato___healthy",
    symptoms: "Healthy tomato plant with deep green leaves and no curling or spots.",
    treatment: "None required.",
    prevention: "Ensure support with stakes and consistent fertilization."
  }
];

module.exports = diseases;