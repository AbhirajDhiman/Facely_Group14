import "../css/EditProfileModal.css";

const EditProfileModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Profile</h2>
        <form className="edit-form">
          <label>
            Name:
            <input type="text" defaultValue={user.name} />
          </label>
          <label>
            Profile Picture URL:
            <input type="text" defaultValue={user.profilePic} />
          </label>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
