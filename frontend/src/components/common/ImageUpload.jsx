import { FaEdit} from 'react-icons/fa';
import { useRef } from 'react';

const ImageUpload = ({ image, label, onChange }) => {
  const fileInputRef = useRef();

  return (
    <div className="image-upload-box">
      <div
        className="image-wrapper"
        onClick={() => fileInputRef.current?.click()}
      >
        <img src={image || "/assets/placeholder.png"} alt={label} />
        <div className="overlay edit-icon"><FaEdit/><span>edit</span></div>
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={(e) => onChange(e.target.files[0])}
        width={100}
      />
    </div>
  );
};

export default ImageUpload;