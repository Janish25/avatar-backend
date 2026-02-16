/**
 * Example: Frontend Integration in Your Main App
 * 
 * This shows how to navigate from your app to avatar creator
 * and handle the redirect back to lobby
 */

import React, { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

/**
 * Example 1: Navigate to Avatar Creator from Your App
 */
export const ProfilePage = () => {
    const [user, setUser] = useState(null);

    const handleCreateAvatar = () => {
        // Get user ID from your auth system
        const userId = user.adUserId; // or from localStorage, context, etc.
        
        // Navigate to avatar creator
        // Update the URL based on your routing setup
        window.location.href = `/create-avatar?userId=${userId}`;
        
        // OR if using React Router:
        // navigate(`/create-avatar?userId=${userId}`);
    };

    const handleEditAvatar = () => {
        const userId = user.adUserId;
        window.location.href = `/create-avatar?userId=${userId}&mode=edit`;
    };

    return (
        <div>
            <h1>Profile</h1>
            {!user?.avatar ? (
                <button onClick={handleCreateAvatar}>
                    Create Avatar
                </button>
            ) : (
                <button onClick={handleEditAvatar}>
                    Edit Avatar
                </button>
            )}
        </div>
    );
};

/**
 * Example 2: Load Avatar in Lobby
 */
export const LobbyPage = () => {
    const [avatarData, setAvatarData] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Get userId from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const avatarType = urlParams.get('avatar');

        if (userId) {
            loadUserAvatar(userId);
        }
    }, []);

    const loadUserAvatar = async (userId) => {
        try {
            // Fetch avatar data from your backend
            const response = await fetch(`/api/avatar/${userId}`);
            const result = await response.json();
            
            if (!result.error) {
                setAvatarData(result.data);
                // Load 3D model
                load3DAvatar(result.data.avatarUrl);
            }
        } catch (error) {
            console.error('Error loading avatar:', error);
        }
    };

    const load3DAvatar = (avatarUrl) => {
        if (!canvasRef.current) return;

        // Set up Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current,
            alpha: true 
        });

        renderer.setSize(400, 400);
        camera.position.z = 2;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Load GLB model
        const loader = new GLTFLoader();
        loader.load(
            avatarUrl,
            (gltf) => {
                const model = gltf.scene;
                
                // Scale and position
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 1.5 / maxDim;
                model.scale.setScalar(scale);
                
                scene.add(model);

                // Animation loop
                const animate = () => {
                    requestAnimationFrame(animate);
                    model.rotation.y += 0.01;
                    renderer.render(scene, camera);
                };
                animate();
            },
            undefined,
            (error) => {
                console.error('Error loading 3D model:', error);
            }
        );
    };

    return (
        <div className="lobby">
            <h1>Welcome to the Lobby!</h1>
            
            <div className="avatar-display">
                <h2>Your Avatar</h2>
                {avatarData && (
                    <div>
                        <p>Type: {avatarData.avatarType}</p>
                        <p>Gender: {avatarData.gender}</p>
                        <canvas ref={canvasRef} />
                    </div>
                )}
            </div>

            {/* Rest of your lobby UI */}
        </div>
    );
};

/**
 * Example 3: React Router Integration
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Your existing routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/lobby" element={<LobbyPage />} />
                
                {/* Avatar creator route */}
                <Route path="/create-avatar" element={<AvatarCreatorPage />} />
                
                {/* Redirect after avatar creation */}
                <Route 
                    path="/avatar-created" 
                    element={<Navigate to="/lobby" replace />} 
                />
            </Routes>
        </BrowserRouter>
    );
};

/**
 * Example 4: Check if User Has Avatar
 */
export const useUserAvatar = (userId) => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAvatar, setHasAvatar] = useState(false);

    useEffect(() => {
        const checkAvatar = async () => {
            try {
                const response = await fetch(`/api/avatar/${userId}`);
                const result = await response.json();
                
                if (!result.error && result.data) {
                    setAvatar(result.data);
                    setHasAvatar(true);
                } else {
                    setHasAvatar(false);
                }
            } catch (error) {
                console.error('Error checking avatar:', error);
                setHasAvatar(false);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            checkAvatar();
        }
    }, [userId]);

    return { avatar, loading, hasAvatar };
};

// Usage in component:
export const Dashboard = () => {
    const user = useAuth(); // Your auth hook
    const { avatar, loading, hasAvatar } = useUserAvatar(user?.id);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {!hasAvatar ? (
                <div>
                    <p>You don't have an avatar yet!</p>
                    <button onClick={() => window.location.href = `/create-avatar?userId=${user.id}`}>
                        Create Avatar
                    </button>
                </div>
            ) : (
                <div>
                    <p>Welcome back! Your avatar is ready.</p>
                    {/* Display avatar */}
                </div>
            )}
        </div>
    );
};
