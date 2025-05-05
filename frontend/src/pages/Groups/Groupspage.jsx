import React, { useState, useEffect, useRef } from 'react';
import './GroupsPage.css'; // Import the CSS file
import axios from 'axios';


// --- API Call Functions ---

const API_BASE_URL = 'http://localhost:5001/api'; // Adjust if your API is hosted elsewhere

// Fetches user's created and joined groups
// NOTE: Assumes a backend endpoint like GET /api/user/my-groups exists.
// You'll need to create this endpoint on your backend.
// It should return { success: true, createdGroups: [...], joinedGroups: [...] }
const fetchUserGroups = async (userId) => {
    console.log(`Fetching groups for user: ${userId}`);
    try {
        const response = await axios.get(`${API_BASE_URL}/group/my-groups`, {
            withCredentials: true, // Ensures cookies are included for authentication
        });

        const data = response.data;
        if (!data.success) {
             throw new Error(data.message || 'Failed to fetch groups');
        }
        // Ensure the backend returns arrays, even if empty
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

        const data = response.data; // Read response body regardless of status

        if (!response.ok || !data.success) {
             throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

// Joins an existing group using an invite code
const joinGroupAPI = async (inviteCode, userId) => {
    console.log(`User ${userId} joining group with code: ${inviteCode}`);
    try {
        const response = await axios.post(`${API_BASE_URL}/group/join`, {
            inviteCode,
        }, {
            withCredentials: true,
        });

        const data = response.data;

        if (!response.ok || !data.success) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data; // { success: true, group: { ... } }
    } catch (error) {
        console.error("Error joining group:", error);
        throw error;
    }
};

// Fetches group details (Info + Images visible to user)
// NOTE: This function makes TWO API calls:
// 1. To get group metadata (name, creator, members) - assumes GET /api/group/:groupId exists
// 2. To get images visible to the user (using your existing endpoint)
const fetchGroupDetailsAPI = async (groupId, userId) => {
    console.log(`Fetching details for group ${groupId} for user ${userId}`);
    try {
        // --- Call 1: Get Group Metadata (Assumed Endpoint) ---
        const groupInfoResponse = await axios.get(`${API_BASE_URL}/group/${groupId}`, {
            withCredentials: true,
        });
        
        if (!groupInfoResponse.data.success) {
            throw new Error(groupInfoResponse.data.message || 'Failed to fetch group metadata');
        }

        // --- Call 2: Get Group Images (Existing Endpoint) ---
        const imagesResponse = await axios.get(`${API_BASE_URL}/group/${groupId}/images`, {
            withCredentials: true,
        });

        if (!imagesResponse.data.success) {
            throw new Error(imagesResponse.data.message || 'Failed to fetch group images');
        }

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
    try {
        const response = await axios.post(`${API_BASE_URL}/group/${groupId}/upload`, file, {
            withCredentials: true,
        });

        const data = response.data;

        if (!response.ok || !data.success) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        // Backend returns { success: true, visibleTo: [...], pictureId: "..." }
        // It does NOT return the full image object (URL, etc.) needed for optimistic update.
        // We will refetch images in the component instead.
        return data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};


// --- Components (Mostly unchanged, except for interactions with API functions) ---

// Displays a single group card
function GroupCard({ group, onClick }) {
    return (
        <div className="group-card" onClick={() => onClick(group._id)}>
            <h3>{group.name}</h3>
            {/* Only show invite code if available and maybe only for creators? */}
            {/* <p>Invite Code: {group.inviteCode || 'N/A'}</p> */}
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
        setName(''); // Clear input after submission attempt
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
        setInviteCode(''); // Clear input after submission attempt
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

    // Only show upload if current user is the creator
    if (userId !== groupCreatorId) {
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
        // Pass the file to the parent component's handler
        await onUploadSuccess(groupId, selectedFile);
        // Clear selection after attempt
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
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
                accept="image/*" // Accept only image files
                style={{ display: 'none' }} // Hide the default input
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
                            // Use uploadedBy name from populated data
                            alt={`Uploaded by ${image.uploadedBy?.name || 'Unknown'}`}
                            loading="lazy" // Lazy load images
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src="https://placehold.co/200x180/CCCCCC/FFFFFF?text=Error";
                                e.target.alt = "Image failed to load";
                            }}
                         />
                         {/* Display uploader's name */}
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
    const [groupDetails, setGroupDetails] = useState(null); // Stores group metadata
    const [images, setImages] = useState([]); // Stores visible images
    const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
    const [isUploading, setIsUploading] = useState(false); // Loading state for uploads
    const [error, setError] = useState('');

    // Function to load group details and images
    const loadGroupData = async () => {
        setIsLoading(true); // Set loading true for refetch too
        setError('');
        try {
            const response = await fetchGroupDetailsAPI(groupId, userId);
            if (response.success) {
                setGroupDetails(response.group);
                setImages(response.images);
            } else {
                // Error handled by fetchGroupDetailsAPI, re-throwing it
                 throw new Error(response.message || 'Failed to fetch group details');
            }
        } catch (err) {
            console.error("Error loading group data:", err);
            setError(err.message || 'Could not load group information.');
            // Clear potentially stale data on error
            setGroupDetails(null);
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };


    // Initial load
    useEffect(() => {
        loadGroupData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId, userId]); // Reload if groupId or userId changes

    // Handler for successful image upload - Refetch images
    const handleImageUploadSuccess = async (id, file) => {
        setIsUploading(true);
        setError('');
        try {
            // Call the API to upload
            await uploadImageAPI(id, file, userId);
            // If upload successful, refetch the images to show the new one
            await loadGroupData(); // Reload all group data including images
        } catch (err) {
             console.error("Error during image upload process:", err);
             setError(err.message || 'Image upload failed.');
        } finally {
            setIsUploading(false);
        }
    };


    // Display loading state only on initial load or if details are missing
    if (isLoading && !groupDetails) {
        return <div className="loading-container"><p>Loading Group Details...</p></div>;
    }

    // Display error if initial load failed or groupDetails are missing after load attempt
    if (!isLoading && !groupDetails) {
        return (
            <div className="error-container">
                <p>Error: {error || 'Group not found or could not be loaded.'}</p>
                <button onClick={onBack} className="back-button">Go Back</button>
            </div>
        );
    }

    // Render the detail page content
    return (
        <div className="group-detail-page">
            <button onClick={onBack} className="back-button">&larr; Back to Groups</button>

            {/* Display Group Info */}
            {groupDetails && (
                <>
                    <h1>{groupDetails.name}</h1>
                    <p className="invite-code-display">Invite Code: {groupDetails.inviteCode}</p>
                    {/* Check if creator info is available */}
                    <p>Created by: {groupDetails.creator === userId ? 'You' : (groupDetails.creator?.name || 'Another User')}</p>
                    <p>Members: {groupDetails.members?.length || 0}</p>
                </>
            )}

             {/* Display general errors (e.g., upload failure) */}
            {error && !isLoading && <p className="error-message">{error}</p>}


            {/* Image Upload Section (conditionally rendered) */}
            {groupDetails && (
                <ImageUpload
                    groupId={groupId}
                    onUploadSuccess={handleImageUploadSuccess} // Use the success handler
                    isLoading={isUploading}
                    userId={userId}
                    groupCreatorId={groupDetails.creator} // Pass creator ID
                />
            )}

            {/* Image Gallery Section */}
            {/* Pass images state and separate loading indicator for gallery */}
            <ImageGallery images={images} isLoading={isLoading} />
        </div>
    );
}

// Main component managing groups view and detail view
function GroupsPage() {
    const [createdGroups, setCreatedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading initial group lists
    const [isCreating, setIsCreating] = useState(false); // Loading state for create action
    const [isJoining, setIsJoining] = useState(false); // Loading state for join action
    const [error, setError] = useState('');

    // *** Replace 'currentUser123' with the actual logged-in user ID ***
    // This should ideally come from your authentication context or state management
    const userId = 'currentUser123';

    // Function to load user's groups
    const loadUserGroups = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Call the API function (which assumes /api/user/my-groups exists)
            const data = await fetchUserGroups(userId);
            setCreatedGroups(data.createdGroups);
            setJoinedGroups(data.joinedGroups);
        } catch (err) {
            console.error("Error loading groups:", err);
            setError(err.message || 'Failed to load your groups. Please try again.');
            setCreatedGroups([]); // Clear on error
            setJoinedGroups([]);
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch initial groups on component mount
    useEffect(() => {
        if (userId) { // Only fetch if userId is available
            loadUserGroups();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]); // Refetch if userId changes (e.g., on login/logout)

    // Handler for creating a group
    const handleCreateGroup = async (name) => {
        setIsCreating(true);
        setError('');
        try {
            const response = await createGroupAPI(name, userId);
            if (response.success) {
                // Add the new group to the list immediately
                setCreatedGroups(prev => [...prev, response.group]);
            }
             // Error is caught below
        } catch (err) {
            console.error("Error creating group:", err);
            setError(err.message || 'Failed to create group.');
        } finally {
            setIsCreating(false);
        }
    };

    // Handler for joining a group
    const handleJoinGroup = async (inviteCode) => {
        setIsJoining(true);
        setError('');
        try {
            const response = await joinGroupAPI(inviteCode, userId);
             if (response.success) {
                // Check if user is already in the group (either created or joined)
                const isAlreadyMember = createdGroups.some(g => g._id === response.group._id) ||
                                        joinedGroups.some(g => g._id === response.group._id);

                if (!isAlreadyMember) {
                    setJoinedGroups(prev => [...prev, response.group]);
                }
                 // Optionally switch view, though staying on the list might be better UX
                 // setSelectedGroupId(response.group._id);
            }
             // Error is caught below
        } catch (err) {
            console.error("Error joining group:", err);
            setError(err.message || 'Failed to join group. Check the code and try again.');
        } finally {
            setIsJoining(false);
        }
    };

    // Handler for selecting a group to view details
    const handleGroupClick = (groupId) => {
        setSelectedGroupId(groupId);
        setError(''); // Clear previous errors when navigating
    };

    // Handler for going back from detail view
    const handleBack = () => {
        setSelectedGroupId(null);
        setError('');
        // Optionally refetch groups if needed, e.g., if membership could have changed
        // loadUserGroups();
    };

    // Render loading state for initial group list fetch
    if (isLoading) {
        return <div className="loading-container"><p>Loading Your Groups...</p></div>;
    }

    // Render group detail page if a group is selected
    if (selectedGroupId) {
        return <GroupDetailPage groupId={selectedGroupId} onBack={handleBack} userId={userId} />;
    }

    // Render main groups page (lists and forms)
    return (
        <div className="groups-page">
            <h1>Your Groups</h1>

            {/* Display errors from create/join actions */}
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

// Export the main page component to be used in App.jsx
export default GroupsPage;

