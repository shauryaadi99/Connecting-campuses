import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { USER_API_ENDPOINT } from "../constants";
import axios from "axios";

// Animations (keep as is)
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 106, 0, 0.5); }
  70% { box-shadow: 0 0 0 15px rgba(255, 106, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 106, 0, 0); }
`;

// Styled Components (keep as is)
const FullscreenContainer = styled.div`
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top left, #1e3c72, #2a5298);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const CardContainer = styled.div`
  max-width: 380px;
  width: 100%;
  padding: 30px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  text-align: center;
  animation: ${fadeIn} 0.8s ease forwards;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.05) rotateZ(-0.5deg);
    box-shadow: 0 0 30px rgba(255, 106, 0, 0.5), 0 12px 50px rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ProfileImage = styled.img`
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(135deg, #ff6a00, #ee0979);
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    animation: ${pulse} 1.5s infinite;
    transform: scale(1.05);
  }
`;

const Name = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: color 0.3s;

  &:hover {
    color: #ff6a00;
    cursor: pointer;
  }
`;

const Bio = styled.p`
  font-size: 1.05rem;
  color: #e0e0e0;
  margin-bottom: 25px;
  padding: 0 10px;
  line-height: 1.6;
  opacity: 0.9;
  transition: 0.3s ease;

  &:hover {
    opacity: 1;
    color: #fff;
  }
`;

const Button = styled.button`
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6a00, #ee0979);
  color: #fff;
  font-size: 1.1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 106, 0, 0.4);
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #ee0979, #ff6a00);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(255, 106, 0, 0.6);
  }

  &::after {
    content: "→";
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: 0.3s;
  }

  &:hover::after {
    opacity: 1;
    right: 15px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const SocialIcon = styled.a`
  color: #ddd;
  font-size: 1.6rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ff6a00;
    transform: scale(1.3) translateY(-3px);
  }
`;

// Main Component
const ProfileCard = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage instead of making an API call
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      // Optional: hit logout API if needed (you can remove this if you're fully client-side)
      // await axios.post(`${USER_API_ENDPOINT}/api/user/logout`, {}, {
      //   withCredentials: true,
      // });

      // Clear localStorage and state
      localStorage.removeItem("user");
    } catch (err) {
      console.warn("Logout failed, clearing UI anyway.");
    }
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return (
      <FullscreenContainer>
        <p className="text-white text-lg">Loading profile...</p>
      </FullscreenContainer>
    );
  }

  if (!user) {
    return (
      <FullscreenContainer>
        <p className="text-white text-lg">Please login to view your profile.</p>
      </FullscreenContainer>
    );
  }

  return (
    <div className="pt-20">
      <FullscreenContainer>
        <CardContainer>
          <ProfileImage
            src={
              user.avatarUrl ||
              "https://avatars.githubusercontent.com/u/9919?s=200&v=4"
            }
            alt="Profile"
          />

          <Name>{user.name || user.email}</Name>

          <Bio className="text-sm text-white/80 mt-4 space-y-1 leading-relaxed text-left">
            <div>
              <span className="font-semibold text-white">Email:</span>{" "}
              <span className="font-medium">{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Phone:</span>{" "}
              {user.phone || <span className="italic text-gray-300">N/A</span>}
            </div>
            <div>
              <span className="font-semibold text-white">Graduating:</span>{" "}
              {user.graduatingYear || (
                <span className="italic text-gray-300">N/A</span>
              )}
            </div>
            {/* <div>
              <span className="font-semibold text-white">Department:</span>{" "}
              {user.department || (
                <span className="italic text-gray-300">N/A</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-white">About:</span>{" "}
              {user.description || (
                <span className="italic text-gray-300">N/A</span>
              )}
            </div> */}
            <div>
              <span className="font-semibold text-white">College:</span>{" "}
              <span>Birla Institute of Technology, Mesra</span>
            </div>
          </Bio>

          <Link to="/update-profile">
            <Button className="mt-4">Update Info</Button>
          </Link>

          <Button
            onClick={handleLogout}
            className="mt-4 ml-2.5 bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>

          {/* <SocialIcons>
            <SocialIcon
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </SocialIcon>
            <SocialIcon
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </SocialIcon>
            <SocialIcon
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </SocialIcon>
          </SocialIcons> */}
        </CardContainer>
      </FullscreenContainer>
    </div>
  );
};

export default ProfileCard;
