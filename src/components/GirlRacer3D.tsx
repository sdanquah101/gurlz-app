<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Girly Racer 3D: SRH Choices</title>
  <!-- Three.js library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    
    body {
      margin: 0;
      overflow: hidden;
      background: linear-gradient(135deg, #FFDEE9, #B5FFFC);
      font-family: 'Poppins', sans-serif;
    }
    
    canvas {
      display: block;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.85));
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      z-index: 10;
      padding: 20px;
      box-sizing: border-box;
      transition: all 0.5s ease;
    }
    
    .overlay h1 {
      color: #c71585;
      font-size: min(4em, 10vw);
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .overlay p {
      font-size: 1.2em;
      color: #333;
      margin-bottom: 20px;
      max-width: 600px;
      line-height: 1.5;
    }
    
    .button {
      padding: 12px 24px;
      font-size: 1.2em;
      color: #fff;
      background: #ff69b4;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      margin: 10px;
    }
    
    .button:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      background: #ff1493;
    }
    
    .text-bubble {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #ff69b4; /* Unified color for good & bad */
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      pointer-events: none;
      white-space: nowrap;
      z-index: 5;
      transition: opacity 0.3s ease;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      max-width: 250px;
      text-align: center;
    }
    
    .arrow {
      position: absolute;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      z-index: 5;
    }
    
    .arrow.down {
      border-top: 8px solid #ff69b4; /* Unified color for good & bad */
    }
    
    .arrow.up {
      border-bottom: 8px solid #ff69b4; /* Unified color for good & bad */
    }
    
    /* Game UI elements */
    .game-ui {
      position: absolute;
      padding: 10px;
      z-index: 20;
      color: #fff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
      font-weight: 600;
      display: flex;
      align-items: center;
      background: rgba(255, 105, 180, 0.7);
      border-radius: 10px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    }
    
    #scoreboard {
      top: 10px;
      left: 10px;
      font-size: 18px;
    }
    
    #level-display {
      top: 10px;
      right: 10px;
      font-size: 18px;
    }
    
    #health-container {
      top: 60px;
      left: 10px;
      padding: 5px 10px;
    }
    
    #health-bar {
      width: 150px;
      height: 15px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      overflow: hidden;
      margin-left: 10px;
    }
    
    #health-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff0055, #ff69b4);
      width: 100%;
      transition: width 0.3s ease;
    }
    
    #timer {
      bottom: 10px;
      right: 10px;
      font-size: 20px;
    }
    
    #feedback {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
      opacity: 0;
      z-index: 15;
      transition: opacity 0.3s ease;
    }
    
    .hint-panel {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.8);
      padding: 10px;
      border-radius: 8px;
      max-width: 300px;
      font-size: 14px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      z-index: 20;
      border-left: 4px solid #ff69b4;
    }
    
    .hint-title {
      font-weight: bold;
      color: #c71585;
      margin-bottom: 5px;
    }
    
    .game-controls {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .control-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    
    .key {
      background: #fff;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 5px;
      margin-right: 10px;
      font-weight: bold;
    }
    
    /* Modal for displaying information */
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 30;
      max-width: 80%;
      max-height: 80%;
      overflow-y: auto;
      display: none;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      color: #666;
    }
    
    .modal-title {
      color: #c71585;
      margin: 0;
    }
    
    .fact-card {
      background: #f9f9f9;
      border-left: 4px solid #ff69b4;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
    }
    
    /* Responsive design adjustments */
    @media (max-width: 768px) {
      .overlay h1 {
        font-size: 2.5em;
      }
      
      .button {
        padding: 10px 20px;
        font-size: 1em;
      }
      
      #health-bar {
        width: 100px;
      }
      
      .hint-panel {
        max-width: 250px;
        font-size: 12px;
      }
    }
    
    /* New additions for the power-ups and effects */
    .power-up-icon {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 20;
    }
    
    .power-up {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      opacity: 0.5;
      transition: all 0.3s ease;
    }
    
    .power-up.active {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .shield {
      background: #4285f4;
    }
    
    .magnet {
      background: #ea4335;
    }
    
    .slow {
      background: #fbbc05;
    }
    
    /* Progress indicator */
    #level-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 5px;
      background: #ff69b4;
      width: 0%;
      transition: width 0.5s ease;
      z-index: 25;
    }
  </style>
</head>
<body>
  <!-- Game UI Elements -->
  <div id="scoreboard" class="game-ui">Score: 0</div>
  <div id="level-display" class="game-ui">Level: 1</div>
  <div id="health-container" class="game-ui">
    Health:
    <div id="health-bar">
      <div id="health-fill"></div>
    </div>
  </div>
  <div id="timer" class="game-ui">Time: 10000s</div>
  <div id="feedback"></div>
  <div id="level-progress"></div>
  
  <!-- Power-up indicators -->
  <div class="power-up-icon">
    <div class="power-up shield" id="shield-icon">S</div>
    <div class="power-up magnet" id="magnet-icon">M</div>
    <div class="power-up slow" id="slow-icon">T</div>
  </div>
  
  <!-- Hint Panel -->
  <div class="hint-panel" id="hint-panel">
    <div class="hint-title">Tip:</div>
    <div id="hint-text">Collect good SRH advice and avoid harmful information to complete the level!</div>
  </div>
  
  <!-- Start Screen Overlay -->
  <div id="startScreen" class="overlay">
    <h1>Girly Racer 3D</h1>
    <p>
      Navigate through the road of sexual and reproductive health knowledge. 
      Collect advice to earn points while avoiding misinformation.
      Learn about important SRH topics as you progress through levels!
    </p>
    <div class="game-controls">
      <div class="control-item">
        <span class="key">←</span> <span>Move Left</span>
      </div>
      <div class="control-item">
        <span class="key">→</span> <span>Move Right</span>
      </div>
      <div class="control-item">
        <span class="key">Space</span> <span>Use Power-up</span>
      </div>
    </div>
    <button id="startButton" class="button">Start Game</button>
    <button id="infoButton" class="button">SRH Information</button>
  </div>
  
  <!-- Game Over Overlay -->
  <div id="gameOverScreen" class="overlay" style="display: none;">
    <h1>Game Over</h1>
    <p id="finalScore"></p>
    <p id="gameOverMessage">You've learned some valuable SRH information!</p>
    <div id="factsLearned"></div>
    <button id="restartButton" class="button">Play Again</button>
    <button id="menuButton" class="button">Main Menu</button>
  </div>
  
  <!-- Level Complete Overlay -->
  <div id="levelCompleteScreen" class="overlay" style="display: none;">
    <h1>Level Complete!</h1>
    <p id="levelScore"></p>
    <p id="levelFact" style="font-style: italic; color: #c71585;"></p>
    <button id="nextLevelButton" class="button">Next Level</button>
  </div>
  
  <!-- Pause Menu Overlay -->
  <div id="pauseScreen" class="overlay" style="display: none; background: rgba(0,0,0,0.7);">
    <h1>Game Paused</h1>
    <button id="resumeButton" class="button">Resume</button>
    <button id="quitButton" class="button">Quit to Menu</button>
  </div>
  
  <!-- Info Modal -->
  <div id="infoModal" class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Sexual & Reproductive Health Information</h2>
      <button class="modal-close" id="closeInfoModal">×</button>
    </div>
    <div class="modal-content">
      <div class="fact-card">
        <h3>Contraception</h3>
        <p>Using contraception consistently and correctly is essential for preventing unintended pregnancies. Options include hormonal methods (pills, patches, rings), barrier methods (condoms), IUDs, and more.</p>
      </div>
      <div class="fact-card">
        <h3>STI Prevention</h3>
        <p>Sexually transmitted infections (STIs) can be prevented through safer sex practices, including condom use, regular testing, and open communication with partners about sexual health.</p>
      </div>
      <div class="fact-card">
        <h3>Consent</h3>
        <p>Consent must be freely given, enthusiastic, and can be withdrawn at any time. Everyone has the right to say no or change their mind about any sexual activity.</p>
      </div>
      <div class="fact-card">
        <h3>Reproductive Health Check-ups</h3>
        <p>Regular check-ups with healthcare providers are important for maintaining reproductive health, including screenings for cancers, STIs, and other conditions.</p>
      </div>
    </div>
  </div>

  <script>
    // Global variables
    let scene, camera, renderer, clock;
    let car;
    let road;
    let obstacles = [];
    let powerUps = [];
    let obstacleSpawnInterval;
    let gameRunning = false;
    let score = 0;
    let level = 1;
    let health = 100;
    let timeRemaining = 10000;
    let timerInterval;
    let keys = {};
    let factsCollected = [];
    let roadSpeed = 8;
    let gameStartTimestamp;
    
    // Player power-ups
    let activePowerUps = {
      shield: false,
      magnet: false,
      slowTime: false
    };
    
    // Level data
    const levelData = [
      {
        timeLimit: 10000,
        targetScore: 10,
        obstacleSpeed: 10,
        spawnRate: 2000,
        fact: "Communication is key in relationships - always discuss sexual health with your partner."
      },
      {
        timeLimit: 50,
        targetScore: 15,
        obstacleSpeed: 10,
        spawnRate: 1800,
        fact: "Regular STI testing is important even if you don't have symptoms."
      },
      {
        timeLimit: 45,
        targetScore: 20,
        obstacleSpeed: 12,
        spawnRate: 1500,
        fact: "Consent can be withdrawn at any time - always respect your partner's decisions."
      },
      {
        timeLimit: 40,
        targetScore: 25,
        obstacleSpeed: 14,
        spawnRate: 1200,
        fact: "Multiple forms of contraception can be used together for increased effectiveness."
      },
      {
        timeLimit: 30,
        targetScore: 30,
        obstacleSpeed: 16,
        spawnRate: 1000,
        fact: "Reproductive health includes both physical and mental wellbeing."
      }
    ];
    
    // Enhanced SRH advice arrays
    const goodAdvices = [
      "Always use condoms to prevent STIs and pregnancy",
      "Get regular STI screenings if sexually active",
      "Practice communication about boundaries with partners",
      "Learn about different contraception methods",
      "Seek professional advice for reproductive health concerns",
      "Know that consent can be withdrawn at any time",
      "Understand that abstinence is 100% effective against pregnancy",
      "Talk openly with trusted adults about sexual health questions",
      "Research how emergency contraception works",
      "Know where to access confidential healthcare services",
      "Understand that all bodies develop differently",
      "Learn how to perform breast/testicular self-exams",
      "Respect others' personal boundaries",
      "Know the signs of healthy vs unhealthy relationships",
      "Understand that some STIs can be asymptomatic"
    ];
    
    const badAdvices = [
      "You can't get pregnant the first time you have sex",
      "Pulling out is as effective as using condoms",
      "Birth control pills protect against STIs",
      "You can tell if someone has an STI by looking at them",
      "Douching after sex prevents pregnancy",
      "If you're on your period, you can't get pregnant",
      "STIs always show visible symptoms",
      "You don't need STI testing if you feel healthy",
      "Having sex standing up prevents pregnancy",
      "Drinking soda after sex prevents pregnancy",
      "Condoms make sex completely safe from all risks",
      "You can't get STIs from oral sex",
      "You only need reproductive health check-ups if something hurts",
      "Birth control is only the woman's responsibility",
      "You can't get pregnant while breastfeeding"
    ];
    
    // Facts about SRH that appear when collecting good advice
    const srhFacts = [
      "Human Papillomavirus (HPV) is the most common STI and vaccines are available.",
      "Condoms are the only form of contraception that also protect against most STIs.",
      "Emergency contraception can prevent pregnancy up to 5 days after unprotected sex.",
      "Many STIs don't show symptoms but can still cause long-term health problems.",
      "The menstrual cycle typically lasts 21-35 days, but can vary by person.",
      "Fertility awareness requires tracking multiple body signals, not just cycle dates.",
      "PrEP (Pre-Exposure Prophylaxis) can reduce the risk of HIV infection.",
      "IUDs are over 99% effective at preventing pregnancy for 3-10 years.",
      "Most people with STIs don't know they have them due to lack of symptoms.",
      "Reproductive coercion is a form of relationship abuse.",
      "Sexual health includes emotional, mental, and social well-being.",
      "Some STIs can be transmitted through skin-to-skin contact.",
      "HIV cannot be transmitted through hugging, sharing food, or casual contact.",
      "Annual gynecological exams are recommended regardless of sexual activity.",
      "Hormonal contraception methods may offer benefits beyond pregnancy prevention."
    ];
    
    // Power-up types
    const powerUpTypes = [
      {
        name: "shield",
        color: 0x4285f4,
        duration: 10000,
        effect: "Temporary immunity from bad advice"
      },
      {
        name: "magnet",
        color: 0xea4335,
        duration: 8000,
        effect: "Attracts good advice towards you"
      },
      {
        name: "slowTime",
        color: 0xfbbc05,
        duration: 5000,
        effect: "Slows down all obstacles temporarily"
      }
    ];
    
    // Initialize Three.js scene, camera, and renderer
    function init() {
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xB5FFFC, 20, 100);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.set(0, 12, 25);
      camera.lookAt(0, 0, 0);
      
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xB5FFFC);
      renderer.shadowMap.enabled = true;
      document.body.appendChild(renderer.domElement);
      
      clock = new THREE.Clock();
      
      createLighting();
      createEnvironment();
      createPlayerCar();
      
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      // Event listeners for pause/resume
      document.addEventListener('keydown', function(e) {
        if (e.code === 'Escape' && gameRunning) {
          pauseGame();
        }
      });
    }
    
    // Create lighting for the scene
    function createLighting() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);
      
      // Add hemisphere light for better environment lighting
      const hemisphereLight = new THREE.HemisphereLight(0xB5FFFC, 0x080820, 0.5);
      scene.add(hemisphereLight);
    }
    
    // Create environment elements
    function createEnvironment() {
      // Road with texture
      const roadGeometry = new THREE.PlaneGeometry(10, 200);
      const roadTexture = createRoadTexture();
      const roadMaterial = new THREE.MeshStandardMaterial({ 
        map: roadTexture,
        roughness: 0.8,
        metalness: 0.2
      });
      road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.z = -50;
      road.position.y = -0.1;
      road.receiveShadow = true;
      scene.add(road);
      
      // Ground surrounding the road
      const groundGeometry = new THREE.PlaneGeometry(100, 200);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x91E5FF,
        roughness: 1
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.z = -50;
      ground.position.y = -0.2;
      ground.receiveShadow = true;
      scene.add(ground);
      
      // Add decorative elements on both sides of the road
      addDecorations();
    }
    
    // Create a canvas texture for the road
    function createRoadTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      // Road base color
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Center line (dashed)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10;
      ctx.setLineDash([40, 20]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      
      // Road texture/noise
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 1;
        ctx.fillRect(x, y, size, size);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 10);
      
      return texture;
    }
    
    // Add decorative elements to the scene
    function addDecorations() {
      // Add trees on both sides
      for (let i = -100; i < 100; i += 15) {
        addTree(7, 0, i, 0.8 + Math.random() * 0.4);
        addTree(-7, 0, i, 0.7 + Math.random() * 0.5);
      }
      
      // Add clouds
      for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 60;
        const y = 15 + Math.random() * 10;
        const z = (Math.random() - 0.5) * 150;
        addCloud(x, y, z);
      }
      
      // Add distant mountains
      addMountains();
    }
    
    // Create a stylized tree
    function addTree(x, y, z, scale) {
      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, y + 0.75, z);
      trunk.scale.set(scale, scale, scale);
      trunk.castShadow = true;
      scene.add(trunk);
      
      // Tree top (3 cones for a layered look)
      const treeTopMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      
      const treeTop1 = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 1.5, 8),
        treeTopMaterial
      );
      treeTop1.position.set(x, y + 1.8, z);
      treeTop1.scale.set(scale, scale, scale);
      treeTop1.castShadow = true;
      scene.add(treeTop1);
      
      const treeTop2 = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1.2, 8),
        treeTopMaterial
      );
      treeTop2.position.set(x, y + 2.6, z);
      treeTop2.scale.set(scale, scale, scale);
      treeTop2.castShadow = true;
      scene.add(treeTop2);
      
      const treeTop3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1, 8),
        treeTopMaterial
      );
      treeTop3.position.set(x, y + 3.2, z);
      treeTop3.scale.set(scale, scale, scale);
      treeTop3.castShadow = true;
      scene.add(treeTop3);
    }
    
    // Create a cloud using multiple spheres
    function addCloud(x, y, z) {
      const cloudGroup = new THREE.Group();
      const cloudMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 1
      });
      
      // Create main cloud parts from spheres
      const sizes = [
        { r: 1.5, x: 0,   y: 0,   z: 0   },
        { r: 1.2, x: 1.2, y: -0.1,z: 0   },
        { r: 1.3, x: -1.3,y: 0,   z: 0   },
        { r: 1.1, x: 0.8, y: 0.6, z: 0.3 },
        { r: 1.0, x: -0.5,y: 0.4, z: 0.2 }
      ];
      
      sizes.forEach(size => {
        const cloudPart = new THREE.Mesh(
          new THREE.SphereGeometry(size.r, 8, 8),
          cloudMaterial
        );
        cloudPart.position.set(size.x, size.y, size.z);
        cloudGroup.add(cloudPart);
      });
      
      cloudGroup.position.set(x, y, z);
      scene.add(cloudGroup);
      
      // Add subtle animation
      cloudGroup.userData = {
        speed: Math.random() * 0.02 + 0.01,
        originalX: x
      };
      
      return cloudGroup;
    }
    
    // Create distant mountains for the horizon
    function addMountains() {
      const mountainGeometry = new THREE.BufferGeometry();
      const vertices = [];
      const mountainColor = new THREE.Color(0x9370DB);
      const colors = [];
      
      // Create a series of triangular mountains
      for (let i = -5; i <= 5; i++) {
        const baseX = i * 8;
        const height = 5 + Math.random() * 10;
        
        vertices.push(
          baseX - 5, 0, -100,
          baseX + 5, 0, -100,
          baseX,     height, -100
        );
        
        for (let j = 0; j < 3; j++) {
          colors.push(mountainColor.r, mountainColor.g, mountainColor.b);
        }
      }
      
      mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      mountainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
      const mountainMaterial = new THREE.MeshBasicMaterial({ 
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      const mountains = new THREE.Mesh(mountainGeometry, mountainMaterial);
      scene.add(mountains);
    }
    
    // Create the player's car
    function createPlayerCar() {
      const carGroup = new THREE.Group();
      
      // Car body
      const bodyGeometry = new THREE.BoxGeometry(1.3, 0.4, 2.2);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff1493,
        metalness: 0.8,
        roughness: 0.3
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      carGroup.add(body);
      
      // Car top
      const topGeometry = new THREE.BoxGeometry(1, 0.3, 1.2);
      const top = new THREE.Mesh(topGeometry, bodyMaterial);
      top.position.set(0, 0.8, -0.1);
      top.castShadow = true;
      carGroup.add(top);
      
      // Car wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
      const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.9
      });
      
      const wheelPositions = [
        { x: -0.7, y: 0.3, z: 0.7 },
        { x: 0.7,  y: 0.3, z: 0.7 },
        { x: -0.7, y: 0.3, z: -0.7 },
        { x: 0.7,  y: 0.3, z: -0.7 }
      ];
      
      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });
      
      // Headlights
      const headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        emissive: 0xFFFF00,
        emissiveIntensity: 0.5
      });
      
      const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      leftHeadlight.position.set(-0.5, 0.5, 1.1);
      carGroup.add(leftHeadlight);
      
      const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      rightHeadlight.position.set(0.5, 0.5, 1.1);
      carGroup.add(rightHeadlight);
      
      // Tail lights
      const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        emissive: 0xFF0000,
        emissiveIntensity: 0.5
      });
      
      const leftTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
      leftTaillight.position.set(-0.5, 0.5, -1.1);
      carGroup.add(leftTaillight);
      
      const rightTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
      rightTaillight.position.set(0.5, 0.5, -1.1);
      carGroup.add(rightTaillight);
      
      // Spotlights from headlights
      const spotlight1 = new THREE.SpotLight(0xFFFFCC, 0.8, 10, Math.PI / 6, 0.5);
      spotlight1.position.set(-0.5, 0.5, 1.1);
      spotlight1.target.position.set(-0.5, 0, 5);
      carGroup.add(spotlight1);
      carGroup.add(spotlight1.target);
      
      const spotlight2 = new THREE.SpotLight(0xFFFFCC, 0.8, 10, Math.PI / 6, 0.5);
      spotlight2.position.set(0.5, 0.5, 1.1);
      spotlight2.target.position.set(0.5, 0, 5);
      carGroup.add(spotlight2);
      carGroup.add(spotlight2.target);
      
      // Shield effect (invisible at first)
      const shieldGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const shieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x4285f4,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
      shield.visible = false;
      carGroup.add(shield);
      carGroup.userData.shield = shield;
      
      carGroup.position.set(0, 0.25, 5);
      car = carGroup;
      scene.add(car);
    }
    
    function onWindowResize() {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Keyboard event handlers
    function handleKeyDown(e) {
      keys[e.code] = true;
      // Spacebar for power-up activation
      if (e.code === 'Space' && gameRunning) {
        activateRandomPowerUp();
      }
    }
    
    function handleKeyUp(e) {
      keys[e.code] = false;
    }
    
    // Create a text bubble element (unified color for good & bad)
    function createTextBubble(message, type) {
      const div = document.createElement('div');
      div.className = 'text-bubble';
      div.textContent = message;
      
      // All advice gets the same border color (#ff69b4),
      // but powerups remain golden if you wish
      if (type === "powerup") {
        div.style.borderColor = "#FFD700";
      }
      // else do nothing – it stays #ff69b4 from CSS
      
      document.body.appendChild(div);
      
      const arrow = document.createElement('div');
      arrow.className = 'arrow down';
      div.appendChild(arrow);
      
      return div;
    }
    
    // Spawn an obstacle (good or bad advice) with the SAME geometry/color
    function spawnObstacle() {
      // Limit obstacles to avoid overcrowding
      if (obstacles.length >= 3) return;
      
      // Randomly choose type (but we won't reflect it visually)
      const isGood = Math.random() < 0.6; 
      const type = isGood ? "good" : "bad";
      
      // Select random message from appropriate array
      const message = isGood 
        ? goodAdvices[Math.floor(Math.random() * goodAdvices.length)]
        : badAdvices[Math.floor(Math.random() * badAdvices.length)];
      
      // Unified geometry + color for good/bad
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xff69b4,
        emissive: 0xff69b4,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.2
      });
      
      const obstacle = new THREE.Mesh(geometry, material);
      
      obstacle.position.set((Math.random() - 0.5) * 8, 0.5, -100);
      obstacle.userData = { 
        type: type, 
        message: message,
        rotationSpeed: Math.random() * 0.05 + 0.01,
        bobSpeed: Math.random() * 0.02 + 0.01,
        bobHeight: 0
      };
      
      obstacle.userData.textBubble = createTextBubble(message, type);
      obstacle.castShadow = true;
      
      obstacles.push(obstacle);
      scene.add(obstacle);
    }
    
    // Spawn a power-up (still visually distinct)
    function spawnPowerUp() {
      // 20% chance to spawn, limit to 1 on screen
      if (Math.random() > 0.2 || powerUps.length >= 1) return;
      
      // Choose random power-up type
      const typeIndex = Math.floor(Math.random() * powerUpTypes.length);
      const powerUpType = powerUpTypes[typeIndex];
      
      const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 36);
      const material = new THREE.MeshStandardMaterial({ 
        color: powerUpType.color,
        emissive: powerUpType.color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const powerUp = new THREE.Mesh(geometry, material);
      powerUp.position.set((Math.random() - 0.5) * 8, 0.5, -100);
      powerUp.userData = {
        type: "powerup",
        powerType: powerUpType.name,
        message: powerUpType.effect,
        rotationSpeed: 0.05,
        bobSpeed: 0.03,
        bobHeight: 0
      };
      
      powerUp.userData.textBubble = createTextBubble(powerUpType.effect, "powerup");
      powerUp.castShadow = true;
      
      powerUps.push(powerUp);
      scene.add(powerUp);
    }
    
    // Update the position of a bubble based on projected screen coordinates
    function updateBubble(object) {
      const vector = object.position.clone();
      vector.project(camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
      
      const bubble = object.userData.textBubble;
      if (!bubble) return;
      
      const bubbleWidth = bubble.offsetWidth;
      const bubbleHeight = bubble.offsetHeight;
      let posX = x - bubbleWidth / 2;
      let posY = y - bubbleHeight - 20;
      
      if (posX < 0) posX = 0;
      if (posX + bubbleWidth > window.innerWidth) posX = window.innerWidth - bubbleWidth;
      if (posY < 0) posY = y + 15;
      
      bubble.style.left = posX + "px";
      bubble.style.top = posY + "px";
      
      // Adjust arrow direction
      const arrow = bubble.querySelector('.arrow');
      if (arrow) {
        if (posY < y) {
          arrow.className = 'arrow down';
          arrow.style.top = "";
          arrow.style.bottom = "-5px";
          arrow.style.left = ((x - posX) - 5) + "px"; 
        } else {
          arrow.className = 'arrow up';
          arrow.style.bottom = "";
          arrow.style.top = "-5px";
          arrow.style.left = ((x - posX) - 5) + "px";
        }
      }
      
      // Fade out objects that are far away
      const distance = object.position.distanceTo(car.position);
      if (distance > 50) {
        bubble.style.opacity = Math.max(0, 1 - ((distance - 50) / 30));
      } else {
        bubble.style.opacity = 1;
      }
    }
    
    // Check for collision between car and an object
    function checkCollision(object) {
      const dx = car.position.x - object.position.x;
      const dz = car.position.z - object.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Magnet power-up increases collision radius for good items
      if (activePowerUps.magnet && object.userData.type === "good") {
        return distance < 3;
      }
      
      return distance < 1.5;
    }
    
    // Activate a random power-up if none is active
    function activateRandomPowerUp() {
      if (activePowerUps.shield || activePowerUps.magnet || activePowerUps.slowTime) {
        return;
      }
      
      const powerUpTypesArray = ["shield", "magnet", "slowTime"];
      const randomType = powerUpTypesArray[Math.floor(Math.random() * powerUpTypesArray.length)];
      activatePowerUp(randomType);
    }
    
    // Activate a specific power-up
    function activatePowerUp(type, duration = null) {
      if (!duration) {
        // Default durations
        if (type === "shield") duration = 5000;
        else if (type === "magnet") duration = 7000;
        else if (type === "slowTime") duration = 4000;
      }
      
      activePowerUps[type] = true;
      document.getElementById(`${type}-icon`).classList.add("active");
      
      // Apply power-up effects
      if (type === "shield") {
        showFeedback("Shield Active!");
        car.userData.shield.visible = true;
      } else if (type === "magnet") {
        showFeedback("Magnet Active!");
      } else if (type === "slowTime") {
        showFeedback("Time Slowed!");
        roadSpeed = levelData[level-1].obstacleSpeed * 0.5;
      }
      
      // Set timeout to deactivate
      setTimeout(() => {
        deactivatePowerUp(type);
      }, duration);
    }
    
    // Deactivate a power-up when its duration ends
    function deactivatePowerUp(type) {
      activePowerUps[type] = false;
      document.getElementById(`${type}-icon`).classList.remove("active");
      
      // Remove power-up effects
      if (type === "shield") {
        car.userData.shield.visible = false;
      } else if (type === "slowTime") {
        roadSpeed = levelData[level-1].obstacleSpeed;
      }
    }
    
    // Display temporary feedback message
    function showFeedback(message, duration = 1500) {
      const feedback = document.getElementById("feedback");
      feedback.textContent = message;
      feedback.style.opacity = 1;
      
      setTimeout(() => {
        feedback.style.opacity = 0;
      }, duration);
    }
    
    // Update the game hint text
    function updateHint(text) {
      document.getElementById("hint-text").textContent = text;
    }
    
    // Main animation loop
    function animate() {
      if (!gameRunning) return;
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      handleCarMovement(delta);
      updateObstacles(delta);
      updatePowerUps(delta);
      updateEnvironment(delta);
      
      // Update level progress bar
      const progress = score / levelData[level-1].targetScore;
      document.getElementById("level-progress").style.width = Math.min(100, progress * 100) + "%";
      
      renderer.render(scene, camera);
    }
    
    // Handle car movement
    function handleCarMovement(delta) {
      let targetVelocityX = 0;
      const acceleration = 15;
      const maxVelocity = 8;
      
      if (keys["ArrowLeft"] && car.position.x > -4) {
        targetVelocityX = -maxVelocity;
      }
      if (keys["ArrowRight"] && car.position.x < 4) {
        targetVelocityX = maxVelocity;
      }
      
      if (!car.userData.velocityX) car.userData.velocityX = 0;
      car.userData.velocityX += (targetVelocityX - car.userData.velocityX) * acceleration * delta;
      car.position.x += car.userData.velocityX * delta;
      
      // Tilt car
      const maxTilt = 0.2;
      const targetTilt = -car.userData.velocityX * 0.05;
      car.rotation.z += (targetTilt - car.rotation.z) * 5 * delta;
      car.rotation.z = THREE.MathUtils.clamp(car.rotation.z, -maxTilt, maxTilt);
      
      // Slight forward/back "bob"
      car.position.z = 5 + Math.sin(performance.now() * 0.002) * 0.1;
    }
    
    // Update obstacles
    function updateObstacles(delta) {
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += roadSpeed * delta;
        
        // Rotation & bobbing
        obs.rotation.y += obs.userData.rotationSpeed;
        obs.userData.bobHeight += obs.userData.bobSpeed;
        obs.position.y = 0.5 + Math.sin(obs.userData.bobHeight) * 0.2;
        
        updateBubble(obs);
        
        if (obs.position.z > car.position.z + 5) {
          // Missed a good advice => penalty
          if (obs.userData.type === "good") {
            takeDamage(5, "Missed important info!");
          }
          removeObstacle(i);
        } else if (checkCollision(obs)) {
          if (obs.userData.type === "good") {
            collectGoodAdvice(obs);
            removeObstacle(i);
          } else if (obs.userData.type === "bad") {
            if (activePowerUps.shield) {
              showFeedback("Bad advice blocked!");
              removeObstacle(i);
            } else {
              takeDamage(20, "Incorrect information!");
              removeObstacle(i);
            }
          }
        }
      }
    }
    
    // Update power-ups
    function updatePowerUps(delta) {
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        pu.position.z += roadSpeed * delta;
        
        pu.rotation.y += pu.userData.rotationSpeed;
        pu.rotation.x += pu.userData.rotationSpeed * 0.5;
        pu.userData.bobHeight += pu.userData.bobSpeed;
        pu.position.y = 0.5 + Math.sin(pu.userData.bobHeight) * 0.3;
        
        updateBubble(pu);
        
        if (pu.position.z > car.position.z + 5) {
          removePowerUp(i);
        } else if (checkCollision(pu)) {
          // Collect power-up
          const powerType = pu.userData.powerType;
          activatePowerUp(powerType);
          removePowerUp(i);
        }
      }
    }
    
    // Update environment elements
    function updateEnvironment(delta) {
      // Scroll road texture
      if (road.material.map) {
        road.material.map.offset.y -= delta * roadSpeed * 0.05;
      }
      
      // Animate clouds horizontally
      scene.children.forEach(object => {
        if (object.userData && object.userData.speed) {
          object.position.x = object.userData.originalX + Math.sin(performance.now() * 0.0005) * 5;
        }
      });
    }
    
    // Remove obstacle
    function removeObstacle(index) {
      const obs = obstacles[index];
      scene.remove(obs);
      document.body.removeChild(obs.userData.textBubble);
      obstacles.splice(index, 1);
    }
    
    // Remove power-up
    function removePowerUp(index) {
      const pu = powerUps[index];
      scene.remove(pu);
      document.body.removeChild(pu.userData.textBubble);
      powerUps.splice(index, 1);
    }
    
    // Collect good advice
    function collectGoodAdvice(obstacle) {
      score++;
      
      // Add random SRH fact
      const factIndex = Math.floor(Math.random() * srhFacts.length);
      const fact = srhFacts[factIndex];
      if (!factsCollected.includes(fact)) {
        factsCollected.push(fact);
      }
      
      showFeedback("+1 Good choice!", 1000);
      document.getElementById("scoreboard").textContent = "Score: " + score;
      
      // Check if level is complete
      if (score >= levelData[level-1].targetScore) {
        levelComplete();
      }
    }
    
    // Take damage
    function takeDamage(amount, message) {
      health -= amount;
      health = Math.max(0, health);
      document.getElementById("health-fill").style.width = health + "%";
      showFeedback(message, 1500);
      cameraShake();
      
      if (health <= 0) {
        gameOver();
      }
    }
    
    // Camera shake effect
    function cameraShake() {
      const originalPosition = { x: 0, y: 12, z: 25 };
      const shakeIntensity = 0.5;
      const shakeDuration = 500;
      const startTime = performance.now();
      
      function updateShake() {
        const elapsed = performance.now() - startTime;
        const progress = elapsed / shakeDuration;
        if (progress < 1) {
          const intensity = shakeIntensity * (1 - progress);
          camera.position.set(
            originalPosition.x + (Math.random() - 0.5) * intensity,
            originalPosition.y + (Math.random() - 0.5) * intensity,
            originalPosition.z + (Math.random() - 0.5) * intensity
          );
          requestAnimationFrame(updateShake);
        } else {
          camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        }
      }
      updateShake();
    }
    
    // Start the level timer
    function startTimer() {
      timeRemaining = levelData[level-1].timeLimit;
      document.getElementById("timer").textContent = "Time: " + timeRemaining + "s";
      
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = "Time: " + timeRemaining + "s";
        if (timeRemaining <= 0) {
          gameOver();
        }
      }, 1000);
    }
    
    // Game over
    function gameOver() {
      gameRunning = false;
      clearInterval(obstacleSpawnInterval);
      clearInterval(timerInterval);
      
      document.getElementById("finalScore").textContent = "Final Score: " + score;
      
      // Show collected facts
      const factsDiv = document.getElementById("factsLearned");
      factsDiv.innerHTML = "";
      if (factsCollected.length > 0) {
        const factsTitle = document.createElement("h3");
        factsTitle.textContent = "Facts Learned:";
        factsDiv.appendChild(factsTitle);
        
        const factsList = document.createElement("ul");
        factsList.style.textAlign = "left";
        factsList.style.maxHeight = "150px";
        factsList.style.overflowY = "auto";
        factsList.style.margin = "10px 0";
        factsList.style.padding = "0 20px";
        factsList.style.listStyleType = "disc";
        
        // Show a few collected facts
        factsCollected.slice(0, 3).forEach(fact => {
          const listItem = document.createElement("li");
          listItem.textContent = fact;
          listItem.style.margin = "5px 0";
          factsList.appendChild(listItem);
        });
        
        factsDiv.appendChild(factsList);
      }
      
      document.getElementById("gameOverScreen").style.display = "flex";
    }
    
    // Level complete
    function levelComplete() {
      gameRunning = false;
      clearInterval(obstacleSpawnInterval);
      clearInterval(timerInterval);
      
      document.getElementById("levelScore").textContent = "Score: " + score + " / " + levelData[level-1].targetScore;
      document.getElementById("levelFact").textContent = "SRH Fact: " + levelData[level-1].fact;
      
      document.getElementById("levelCompleteScreen").style.display = "flex";
    }
    
    // Pause the game
    function pauseGame() {
      if (!gameRunning) return;
      gameRunning = false;
      clock.stop();
      clearInterval(timerInterval);
      document.getElementById("pauseScreen").style.display = "flex";
    }
    
    // Resume the game
    function resumeGame() {
      gameRunning = true;
      clock.start();
      timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = "Time: " + timeRemaining + "s";
        if (timeRemaining <= 0) {
          gameOver();
        }
      }, 1000);
      document.getElementById("pauseScreen").style.display = "none";
      animate();
    }
    
    // Start/restart the game
    function startGame() {
      score = 0;
      health = 100;
      gameRunning = true;
      factsCollected = [];
      roadSpeed = levelData[level-1].obstacleSpeed;
      
      // Hide overlays
      document.getElementById("startScreen").style.display = "none";
      document.getElementById("gameOverScreen").style.display = "none";
      document.getElementById("levelCompleteScreen").style.display = "none";
      
      // Reset scoreboard
      document.getElementById("scoreboard").textContent = "Score: 0";
      document.getElementById("level-display").textContent = "Level: " + level;
      document.getElementById("health-fill").style.width = "100%";
      document.getElementById("level-progress").style.width = "0%";
      
      // Deactivate power-ups
      document.getElementById("shield-icon").classList.remove("active");
      document.getElementById("magnet-icon").classList.remove("active");
      document.getElementById("slow-icon").classList.remove("active");
      Object.keys(activePowerUps).forEach(k => (activePowerUps[k] = false));
      if (car.userData.shield) {
        car.userData.shield.visible = false;
      }
      
      // Clear any existing obstacles/power-ups
      obstacles.forEach(obs => {
        scene.remove(obs);
        if (obs.userData.textBubble) {
          document.body.removeChild(obs.userData.textBubble);
        }
      });
      obstacles = [];
      
      powerUps.forEach(pu => {
        scene.remove(pu);
        if (pu.userData.textBubble) {
          document.body.removeChild(pu.userData.textBubble);
        }
      });
      powerUps = [];
      
      // Reset car
      car.position.set(0, 0.25, 5);
      car.rotation.z = 0;
      car.userData.velocityX = 0;
      
      // Start spawn intervals
      clearInterval(obstacleSpawnInterval);
      obstacleSpawnInterval = setInterval(() => {
        spawnObstacle();
        spawnPowerUp();
      }, levelData[level-1].spawnRate);
      
      // Start timer
      startTimer();
      
      updateHint("Collect SRH advice & avoid misinformation to complete Level " + level + "!");
      gameStartTimestamp = performance.now();
      
      clock.start();
      animate();
    }
    
    // Proceed to next level
    function startNextLevel() {
      if (level < levelData.length) {
        level++;
        startGame();
      } else {
        // All levels completed
        gameRunning = false;
        clearInterval(obstacleSpawnInterval);
        clearInterval(timerInterval);
        
        document.getElementById("finalScore").textContent = "Final Score: " + score;
        document.getElementById("gameOverMessage").textContent =
          "Congratulations! You've completed all levels and learned valuable SRH information!";
        
        // Show final facts
        const factsDiv = document.getElementById("factsLearned");
        factsDiv.innerHTML = "";
        if (factsCollected.length > 0) {
          const factsTitle = document.createElement("h3");
          factsTitle.textContent = "Facts Learned:";
          factsDiv.appendChild(factsTitle);
          
          const factsList = document.createElement("ul");
          factsList.style.textAlign = "left";
          factsList.style.maxHeight = "150px";
          factsList.style.overflowY = "auto";
          factsList.style.margin = "10px 0";
          factsList.style.padding = "0 20px";
          factsList.style.listStyleType = "disc";
          
          factsCollected.slice(0, 3).forEach(fact => {
            const listItem = document.createElement("li");
            listItem.textContent = fact;
            listItem.style.margin = "5px 0";
            factsList.appendChild(listItem);
          });
          
          factsDiv.appendChild(factsList);
        }
        
        document.getElementById("gameOverScreen").style.display = "flex";
      }
    }
    
    // On DOM load
    window.addEventListener("DOMContentLoaded", () => {
      init();
      
      // Start button
      document.getElementById("startButton").addEventListener("click", () => {
        startGame();
      });
      
      // Info button
      document.getElementById("infoButton").addEventListener("click", () => {
        document.getElementById("infoModal").style.display = "block";
      });
      
      // Close Info Modal
      document.getElementById("closeInfoModal").addEventListener("click", () => {
        document.getElementById("infoModal").style.display = "none";
      });
      
      // Restart button
      document.getElementById("restartButton").addEventListener("click", () => {
        level = 1;
        startGame();
      });
      
      // Menu button
      document.getElementById("menuButton").addEventListener("click", () => {
        document.getElementById("gameOverScreen").style.display = "none";
        document.getElementById("startScreen").style.display = "flex";
      });
      
      // Next level button
      document.getElementById("nextLevelButton").addEventListener("click", () => {
        document.getElementById("levelCompleteScreen").style.display = "none";
        startNextLevel();
      });
      
      // Pause menu buttons
      document.getElementById("resumeButton").addEventListener("click", resumeGame);
      document.getElementById("quitButton").addEventListener("click", () => {
        document.getElementById("pauseScreen").style.display = "none";
        document.getElementById("startScreen").style.display = "flex";
      });
    });
  </script>
</body>
</html>
