// ProfileSection.jsx
import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronRight, Upload, Camera, Wallet } from 'lucide-react';
import { WalletContext } from '@/context/WalletContext';
import PropTypes from 'prop-types';

const ProfileSection = ({ formData, handleChange, handleImageChange, handleCategoryChange, handleCategoryChange1, scrollToSection, userType, investorCategory, donationCategory, categories1, sectionRef }) => {
    const { walletAddress } = useContext(WalletContext);
    
    // Get wallet avatar
    const getWalletAvatar = (address) => {
        if (!address) return null;
        return `https://effigy.im/a/${address}.svg`;
    };
    
    // Use wallet avatar as profile picture
    const useWalletAsAvatar = () => {
        if (walletAddress) {
            const walletAvatarUrl = getWalletAvatar(walletAddress);
            
            // Create a fake event object that mimics a file upload
            const fakeEvent = {
                target: {
                    files: []
                }
            };
            
            // Create a fake FileReader result with the wallet avatar URL
            const avatarImage = new Image();
            avatarImage.src = walletAvatarUrl;
            avatarImage.onload = () => {
                // Create a canvas to convert the image to data URL
                const canvas = document.createElement('canvas');
                canvas.width = avatarImage.width;
                canvas.height = avatarImage.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(avatarImage, 0, 0);
                
                // Create a data URL from the canvas
                const dataUrl = canvas.toDataURL('image/png');
                
                // Create a blob from the data URL
                fetch(dataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        // Create a File object
                        const file = new File([blob], 'wallet-avatar.png', { type: 'image/png' });
                        
                        // Set the file in the fake event
                        Object.defineProperty(fakeEvent.target, 'files', {
                            value: [file],
                            writable: false
                        });
                        
                        // Call the handleImageChange function with the fake event
                        handleImageChange(fakeEvent);
                    });
            };
            
            // Handle loading errors
            avatarImage.onerror = () => {
                console.error("Failed to load wallet avatar image");
            };
        }
    };
    
    return (
        <section ref={sectionRef} id="profile-section" className="scroll-mt-40 lg:scroll-mt-36 min-h-screen text-white">
            <div className="text-3xl md:text-4xl font-bold pb-4 md:pb-8">Let&apos;s set your profile</div>
            
            {/* Profile Image Upload Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Profile Picture</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Current Profile Preview */}
                    <div className="relative">
                        <div className="h-32 w-32 md:h-40 md:w-40 bg-[#1A3A2C] border-4 border-[#2C5440] rounded-full flex items-center justify-center overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Profile" className="object-cover h-full w-full" />
                            ) : walletAddress ? (
                                <img src={getWalletAvatar(walletAddress)} alt="Wallet Avatar" className="object-cover h-full w-full" />
                            ) : (
                                <p className="text-gray-400 text-lg text-center font-semibold">No Image</p>
                            )}
                        </div>
                        
                        {/* Camera overlay button */}
                        <label className="absolute bottom-2 right-2 h-10 w-10 bg-[#1A3A2C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2FB574] transition-colors border-2 border-[#2C5440]">
                            <Camera className="h-5 w-5 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    
                    {/* Upload options */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-lg font-medium">Change profile picture</h4>
                        
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 p-3 border border-[#2C5440] rounded-lg cursor-pointer hover:bg-[#1A3A2C] transition-colors">
                                <Upload className="h-5 w-5 text-[#2FB574]" />
                                <span>Upload image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            
                            {walletAddress && (
                                <Button 
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-3 border-[#2C5440] bg-black"
                                    onClick={useWalletAsAvatar}
                                >
                                    <Wallet className="h-5 w-5 text-[#2FB574]" />
                                    Use wallet avatar
                                </Button>
                            )}
                        </div>
                        
                        <p className="text-xs text-gray-400">
                            Recommended: Square JPG or PNG, at least 300x300 pixels
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full border-0 border-b border-[#2C5440] bg-transparent focus:ring-0 focus:outline-none text-xl text-white placeholder:text-gray-100"
                    placeholder="Username"
                />
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-0 border-b border-[#2C5440] bg-transparent focus:ring-0 focus:outline-none text-xl text-white placeholder:text-gray-100"
                    placeholder="Email Address"
                />
                <Select
                    value={formData.category1}
                    onValueChange={handleCategoryChange1}
                    placeholder="Country"
                    className="w-full bg-transparent focus:ring-0 text-white px-2 py-2 placeholder:text-gray-100"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    onFocus={(e) => e.target.style.boxShadow = 'none'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                >
                    <SelectTrigger className="w-full border-0 border-b border-[#2C5440] bg-transparent focus:ring-0 text-white px-2 py-2">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories1.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <a
                    href="#account-section"
                    className={`relative flex w-[80px] text-center items-center p-2 pl-4 rounded-full transition-colors text-md text-white bg-[#2FB574] hover:bg-[#26925e]`}
                    onClick={() => {
                        scrollToSection('account');
                    }}
                >
                    Next
                    <ChevronRight className="h-5 w-5" />
                </a>
            </div>
        </section>
    );
};

ProfileSection.propTypes = {
    formData: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        category1: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleImageChange: PropTypes.func.isRequired,
    handleCategoryChange: PropTypes.func,
    handleCategoryChange1: PropTypes.func.isRequired,
    scrollToSection: PropTypes.func.isRequired,
    userType: PropTypes.string,
    investorCategory: PropTypes.array,
    donationCategory: PropTypes.array,
    categories1: PropTypes.array.isRequired,
    sectionRef: PropTypes.object.isRequired
};

export default ProfileSection;
