import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ARView.css";

function ARView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { model } = state || {};
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const threeInstanceRef = useRef(null);

  // If no model is passed, return to home
  useEffect(() => {
    if (!model) {
      navigate("/");
    }
  }, [model, navigate]);

  // Setup camera stream
  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.classList.add("ar-active");

    async function setupCamera() {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        // Set stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStream(stream);
          console.log("Camera stream acquired successfully");
        }
      } catch (err) {
        console.error("Camera error:", err);
        setErrorMessage(`Camera error: ${err.message}`);
      }
    }

    setupCamera();

    // Clean up when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      document.body.style.overflow = "";
      document.body.classList.remove("ar-active");
    };
  }, []);

  // Load and display 3D model
  useEffect(() => {
    if (!model || !containerRef.current) return;

    let scene, camera, renderer, controls, animationFrameId;
    let isComponentMounted = true;

    // Function to dynamically load THREE once and provide it to the component
    const loadThreeJS = () => {
      return new Promise((resolve) => {
        // Check if THREE is already available globally
        if (window.THREE) {
          threeInstanceRef.current = window.THREE;
          resolve(window.THREE);
          return;
        }

        // If no existing Three.js instance, load it
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js";
        script.async = true;
        script.onload = () => {
          threeInstanceRef.current = window.THREE;
          resolve(window.THREE);
        };
        document.head.appendChild(script);
      });
    };

    // Function to load a specific extension after Three.js is loaded
    const loadExtension = (url) => {
      return new Promise((resolve) => {
        // Only load if not already present
        if (url.includes("GLTFLoader") && threeInstanceRef.current.GLTFLoader) {
          resolve();
          return;
        }
        if (
          url.includes("OrbitControls") &&
          threeInstanceRef.current.OrbitControls
        ) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    async function initThreeJs() {
      try {
        // Load Three.js core once
        const THREE = await loadThreeJS();

        // Now load extensions if needed
        await loadExtension(
          "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js"
        );
        await loadExtension(
          "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"
        );

        // Setup the scene
        scene = new THREE.Scene();

        // Create camera
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background

        // Add renderer to DOM
        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Add controls
        if (THREE.OrbitControls) {
          controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.screenSpacePanning = false;
          controls.maxPolarAngle = Math.PI / 1.5;
          controls.minDistance = 1;
          controls.maxDistance = 10;
        } else {
          console.warn("OrbitControls not available");
          controls = {
            update: function () {
              // Simple rotation fallback
              if (scene) scene.rotation.y += 0.005;
            },
          };
        }

        // Create loading cube to show while model loads
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({
          color: 0x44aaff,
          wireframe: true,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        scene.add(cube);

        // Animation function for the loading cube
        function animateCube() {
          if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
          }
        }

        // Load GLB model
        if (THREE.GLTFLoader) {
          const loader = new THREE.GLTFLoader();

          loader.load(
            model, // Path to your GLB model
            (gltf) => {
              if (!isComponentMounted) return;

              // Model loaded successfully
              scene.remove(cube); // Remove loading cube

              const model3D = gltf.scene;

              // Center and scale model
              const box = new THREE.Box3().setFromObject(model3D);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());

              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 3 / maxDim;
              model3D.scale.set(scale, scale, scale);

              // Center model
              model3D.position.x = -center.x * scale;
              model3D.position.y = -center.y * scale;
              model3D.position.z = -center.z * scale;

              scene.add(model3D);
              setModelLoaded(true);
            },
            (xhr) => {
              // Model loading progress
              if (xhr.lengthComputable && isComponentMounted) {
                const progress = Math.floor((xhr.loaded / xhr.total) * 100);
                setLoadingProgress(progress);
              }
            },
            (error) => {
              // Error loading model
              if (isComponentMounted) {
                console.error("Error loading 3D model:", error);
                setErrorMessage(`Error loading 3D model: ${error.message}`);
              }
            }
          );
        } else {
          setErrorMessage("3D model loader not available");
        }

        // Animation loop
        function animate() {
          if (!isComponentMounted) return;

          animationFrameId = requestAnimationFrame(animate);

          if (!modelLoaded) {
            animateCube(); // Animate cube while model loads
          }

          if (controls) controls.update();
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        }
        animate();

        // Resize handler
        function handleResize() {
          if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
        }

        window.addEventListener("resize", handleResize);

        // Return cleanup function
        return () => {
          isComponentMounted = false;
          window.removeEventListener("resize", handleResize);

          // Cancel animation frame
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }

          // Remove renderer from DOM
          if (containerRef.current && renderer && renderer.domElement) {
            try {
              containerRef.current.removeChild(renderer.domElement);
            } catch (e) {
              console.warn("Could not remove renderer element:", e);
            }
          }

          // Dispose of resources
          if (renderer) renderer.dispose();
          if (cubeGeometry) cubeGeometry.dispose();
          if (cubeMaterial) cubeMaterial.dispose();

          // Don't null out the global THREE instance
        };
      } catch (error) {
        console.error("Three.js initialization error:", error);
        setErrorMessage(`Failed to initialize 3D viewer: ${error.message}`);
      }
    }

    // Initialize Three.js and store cleanup function
    const cleanupFn = initThreeJs();

    // Cleanup function for component unmount
    return () => {
      isComponentMounted = false;
      if (cleanupFn && typeof cleanupFn.then === "function") {
        cleanupFn.then((cleanup) => {
          if (cleanup && typeof cleanup === "function") {
            cleanup();
          }
        });
      } else if (cleanupFn && typeof cleanupFn === "function") {
        cleanupFn();
      }
    };
  }, [model, modelLoaded]);

  // Handle back button
  const handleBack = () => {
    // Stop camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    // Force navigation regardless of any errors
    try {
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Navigation error:", err);
      // As a fallback, if navigation fails, try redirecting
      window.location.href = "/";
    }
  };

  return (
    <div className="ar-view-container">
      {/* Camera video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-feed"
        onCanPlay={(e) => {
          console.log("Video can play");
          e.target.play().catch((err) => console.error("Play error:", err));
        }}
      />

      {/* Container for 3D model renderer */}
      <div ref={containerRef} className="model-container"></div>

      {/* Loading indicator */}
      {!modelLoaded && !errorMessage && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading 3D model... {loadingProgress}%</p>
        </div>
      )}

      {/* Model info overlay */}
      {modelLoaded && !errorMessage && (
        <div className="model-info">
          <p>AR View: {model.split("/").pop()}</p>
          <p className="model-instructions">
            Drag to rotate • Pinch/scroll to zoom
          </p>
        </div>
      )}

      {/* Back button */}
      <button className="back-button" onClick={handleBack}>
        ←
      </button>

      {/* Error message if camera or model loading fails */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          <button onClick={handleBack}>Go Back</button>
        </div>
      )}
    </div>
  );
}

export default ARView;
