import React, { useState, useEffect, useRef } from 'react';
import './GroupsPage.css'; // Import the CSS file
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:5001/api'; // Adjust if your API is hosted elsewhere

// Fetches user's created and joined groups
const fetchUserGroups = async (userId) => {
    console.log(`Fetching groups for user: ${userId}`);
    try {
        const response = await axios.get(`${API_BASE_URL}/group/my-groups`, {
            withCredentials: true, 
        });

        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch groups');
        }

        return {
            createdGroups: data.createdGroups || [],
            joinedGroups: data.joinedGroups || [],
        };
    } catch (error) {
        console.error("Error fetching user groups:", error);
        throw error;
    }
};

// Creates a new group
const createGroupAPI = async (name, userId) => {
    console.log(`Creating group "${name}" for user: ${userId}`);
    try {
        const response = await axios.post(`${API_BASE_URL}/group/create`, {
            name,
        }, {
            withCredentials: true, // Ensures cookies are included for authentication
        });
        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};


const joinGroupAPI = async (inviteCode, userId) => {
    console.log(`User ${userId} joining group with code: ${inviteCode}`);
    try {
        const response = await axios.post(`${API_BASE_URL}/group/join`, {
            inviteCode,
        }, {
            withCredentials: true,
        });

        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || 'Failed to join group');
        }
        return data;
    } catch (error) {
        console.error("Error joining group:", error);
        throw error;
    }
};

// Fetches group details (Info + Images visible to user)
const fetchGroupDetailsAPI = async (groupId, userId) => {
    console.log(`Fetching details for group ${groupId} for user ${userId}`);
    try {

        const groupInfoResponse = await axios.get(`${API_BASE_URL}/group/${groupId}/info`, {
            withCredentials: true,
        });
        
        if (!groupInfoResponse.data.success) {
            throw new Error(groupInfoResponse.data.message || 'Failed to fetch group metadata');
        }

        // --- Call 2: Get Group Images ---
        const imagesResponse = await axios.get(`${API_BASE_URL}/group/${groupId}/images`, {
            withCredentials: true,
        });

        if (!imagesResponse.data.success) {
            throw new Error(imagesResponse.data.message || 'Failed to fetch group images');
        }
        console.log(imagesResponse);
        // --- Combine Results ---
        return {
            success: true,
            group: groupInfoResponse.data.group,
            images: imagesResponse.data.images || [],
        };
    } catch (error) {
        console.error("Error fetching group details:", error);
        throw error;
    }
};

// Uploads an image to a specific group
const uploadImageAPI = async (groupId, file, userId) => {
    console.log(`Uploading image to group ${groupId} by user ${userId}`);
    const formData = new FormData();
    formData.append("image", new Blob([file], { type: file.type }));
    
    try {
        const response = await axios.post(`${API_BASE_URL}/group/${groupId}/upload`, formData, {
            withCredentials: true,
        });

        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

// --- Components ---

// Displays a single group card
function GroupCard({ group, onClick }) {
    return (
        <div className="group-card" onClick={() => onClick(group._id)}>
            <h3>{group.name}</h3>
            <p>Members: {group.members?.length || 0}</p>
        </div>
    );
}

// Displays a list of groups
function GroupList({ title, groups, onGroupClick }) {
    return (
        <div className="group-list-container">
            <h2>{title}</h2>
            {groups.length === 0 ? (
                <p className="info-text">No groups found.</p>
            ) : (
                <div className="group-list">
                    {groups.map(group => (
                        <GroupCard key={group._id} group={group} onClick={onGroupClick} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Form for creating a new group
function CreateGroupForm({ onCreate, isLoading }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || isLoading) return;
        onCreate(name);
        setName('');
    };

    return (
        <div className="form-container create-group-form">
            <h2>Create New Group</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-label="Group Name"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !name.trim()}>
                    {isLoading ? 'Creating...' : 'Create Group'}
                </button>
            </form>
        </div>
    );
}

// Form for joining a group
function JoinGroupForm({ onJoin, isLoading }) {
    const [inviteCode, setInviteCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inviteCode.trim() || isLoading) return;
        onJoin(inviteCode);
        setInviteCode('');
    };

    return (
        <div className="form-container join-group-form">
            <h2>Join Group</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    aria-label="Invite Code"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !inviteCode.trim()}>
                    {isLoading ? 'Joining...' : 'Join Group'}
                </button>
            </form>
        </div>
    );
}

// Component for uploading images (visible only to creator)
function ImageUpload({ groupId, onUploadSuccess, isLoading, userId, groupCreatorId }) {

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    if (userId !== groupCreatorId._id) {
        return null;
    }

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || isLoading) return;
        await onUploadSuccess(groupId, selectedFile);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-upload-container">
            <h3>Upload New Image (Creator Only)</h3>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                aria-label="Select Image"
                disabled={isLoading}
            />
            <button onClick={triggerFileInput} disabled={isLoading} className="select-file-btn">
                {selectedFile ? `Selected: ${selectedFile.name.substring(0, 20)}${selectedFile.name.length > 20 ? '...' : ''}` : 'Choose Image'}
            </button>
            {selectedFile && (
                <button onClick={handleUpload} disabled={isLoading || !selectedFile} className="upload-btn">
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
            )}
        </div>
    );
}

// Component to display the image gallery
function ImageGallery({ images, isLoading }) {
    if (isLoading) {
        return <p className="loading-text">Loading images...</p>;
    }

    if (!images || images.length === 0) {
        return <p className="info-text">No images found in this group that are visible to you.</p>;
    }

    return (
        <div className="image-gallery-container">
            <h3>Group Gallery (Visible to You)</h3>
            <div className="image-grid">
                {images.map(image => (
                    <div key={image._id} className="gallery-item">
                        <img
                            src={image.url}
                            alt={`Uploaded by ${image.uploadedBy?.name || 'Unknown'}`}
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/200x180/CCCCCC/FFFFFF?text=Error";
                                e.target.alt = "Image failed to load";
                            }}
                        />
                        <p className="uploader-name">
                            By: {image.uploadedBy?.name || 'Unknown'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Main Page Components ---

// Page displaying details of a single group
function GroupDetailPage({ groupId, onBack, userId }) {
    const [groupDetails, setGroupDetails] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const loadGroupData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchGroupDetailsAPI(groupId, userId);
            if (response.success) {
                setGroupDetails(response.group);
                setImages(response.images);
            } else {
                throw new Error(response.message || 'Failed to fetch group details');
            }
        } catch (err) {
            console.error("Error loading group data:", err);
            setError(err.message || 'Could not load group information.');
            setGroupDetails(null);
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGroupData();
    }, [groupId, userId]);

    const handleImageUploadSuccess = async (id, file) => {
        setIsUploading(true);
        setError('');
        try {
            await uploadImageAPI(id, file, userId);
            await loadGroupData();
        } catch (err) {
            console.error("Error during image upload process:", err);
            setError(err.message || 'Image upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading && !groupDetails) {
        return <div className="loading-container"><p>Loading Group Details...</p></div>;
    }

    if (!isLoading && !groupDetails) {
        return (
            <div className="error-container">
                <p>Error: {error || 'Group not found or could not be loaded.'}</p>
                <button onClick={onBack} className="back-button">Go Back</button>
            </div>
        );
    }

    return (
        <div className="group-detail-page">
            <button onClick={onBack} className="back-button">← Back to Groups</button>
            {groupDetails && (
                <>
                    <h1>{groupDetails.name}</h1>
                    <p className="invite-code-display">Invite Code: {groupDetails.inviteCode}</p>
                    <p>Created by: {groupDetails.creator === userId ? 'You' : (groupDetails.creator?.name || 'Another User')}</p>
                    <p>Members: {groupDetails.members?.length || 0}</p>
                </>
            )}
            {error && !isLoading && <p className="error-message">{error}</p>}
            {groupDetails && (
                <ImageUpload
                    groupId={groupId}
                    onUploadSuccess={handleImageUploadSuccess}
                    isLoading={isUploading}
                    userId={userId}
                    groupCreatorId={groupDetails.creator}
                />
            )}
            <ImageGallery images={images} isLoading={isLoading} />
        </div>
    );
}

// Main component managing groups view and detail view
function GroupsPage() {
    const [createdGroups, setCreatedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState('');
    const { user} = useAuthStore();
    // console.log(user)

    // Replace with actual user ID from auth context
    const userId = user._id;
    console.log(userId)

    const loadUserGroups = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchUserGroups(userId);
            // Remove duplicates by _id
            const uniqueCreatedGroups = [...new Map(data.createdGroups.map(g => [g._id, g])).values()];
            const uniqueJoinedGroups = [...new Map(data.joinedGroups.map(g => [g._id, g])).values()];
            setCreatedGroups(uniqueCreatedGroups);
            setJoinedGroups(uniqueJoinedGroups);
        } catch (err) {
            console.error("Error loading groups:", err);
            setError(err.message || 'Failed to load your groups. Please try again.');
            setCreatedGroups([]);
            setJoinedGroups([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadUserGroups();
        }
    }, [userId]);

    const handleCreateGroup = async (name) => {
        setIsCreating(true);
        setError('');
        try {
            const response = await createGroupAPI(name, userId);
            if (response.success) {
                setCreatedGroups(prev => [...prev, response.group]);
            }
        } catch (err) {
            console.error("Error creating group:", err);
            setError(err.message || 'Failed to create group.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinGroup = async (inviteCode) => {
        setIsJoining(true);
        setError('');
        try {
            const response = await joinGroupAPI(inviteCode, userId);
            if (response.success) {
                const isAlreadyMember = createdGroups.some(g => g._id === response.group._id) ||
                                        joinedGroups.some(g => g._id === response.group._id);
                if (!isAlreadyMember) {
                    setJoinedGroups(prev => [...prev, response.group]);
                }
            }
        } catch (err) {
            console.error("Error joining group:", err);
            setError(err.message || 'Failed to join group. Check the code and try again.');
        } finally {
            setIsJoining(false);
        }
    };

    const handleGroupClick = (groupId) => {
        setSelectedGroupId(groupId);
        setError('');
    };

    const handleBack = () => {
        setSelectedGroupId(null);
        setError('');
    };

    if (isLoading) {
        return <div className="loading-container"><p>Loading Your Groups...</p></div>;
    }

    if (selectedGroupId) {
        return <GroupDetailPage groupId={selectedGroupId} onBack={handleBack} userId={userId} />;
    }

    return (
        <div className="groups-page">
            <h1>Your Groups</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="forms-section">
                <CreateGroupForm onCreate={handleCreateGroup} isLoading={isCreating} />
                <JoinGroupForm onJoin={handleJoinGroup} isLoading={isJoining} />
            </div>
            <div className="lists-section">
                <GroupList
                    title="Groups You Created"
                    groups={createdGroups}
                    onGroupClick={handleGroupClick}
                />
                <GroupList
                    title="Groups You Joined"
                    groups={joinedGroups}
                    onGroupClick={handleGroupClick}
                />
            </div>
        </div>
    );
}

export default GroupsPage;