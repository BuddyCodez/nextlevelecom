import { Image as NextUiImage } from '@nextui-org/image';
import { useEffect, useState } from 'react';
// Replace with your image library

const SlidingImage = ({ src, alt, width, height } : any) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const handleImageLoad = () => {
            setImageLoaded(true);
        };

        const image = new Image();
        image.src = src;
        image.addEventListener('load', handleImageLoad);

        return () => {
            image.removeEventListener('load', handleImageLoad);
        };
    }, [src]);

    return (
        <div
            className={`relative ${imageLoaded ? 'animate-slide-in' : 'opacity-0 translate-x-full'
                } transition-transform duration-500 ease-in-out transform `}

        >
            <NextUiImage
                removeWrapper
                alt={alt}
                className="object-cover rounded-2xl heroImg sm:w-[300px] sm:h-[300px] self-end"
                src={src}
                width={width}
                height={height}
            />
        </div>
    );
};

export default SlidingImage;
