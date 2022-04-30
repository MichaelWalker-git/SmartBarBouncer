import React, {useEffect, useRef, useState} from "react";

export const Entrance = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const [, setInitialPhotoSrc] = useState("")

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then((stream: MediaStream) => {
                const video = videoRef.current;
                // @ts-ignore
                video.srcObject = stream;
                // @ts-ignore
                video.play().then(r => console.log("play ", r));
            })
            .catch(err => {
                console.error("error:", err);
            });
    };


    const takePhoto = () => {
        const photo: HTMLCanvasElement = photoRef.current as HTMLCanvasElement;
        const strip = stripRef.current;
        const videoCurrent: HTMLVideoElement = videoRef.current as HTMLVideoElement;

        photo?.getContext('2d')?.drawImage(videoCurrent, 0, 0, 200, 200);

        const data = photo.toDataURL("image/jpeg");

        console.warn(data);
        const link = document.createElement("a");
        link.href = data;
        link.setAttribute("download", "myWebcam");
        link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
        // @ts-ignore
        strip?.insertBefore(link, strip?.firstChild);
        setInitialPhotoSrc(data);
    };

    return (
        <div className="container">

            <div className="webcam-video">
                <button onClick={() => takePhoto()}>
                    Take a photo
                </button>
                <video
                    ref={videoRef}
                    className="player"
                />
                <canvas ref={photoRef}
                        className="photo" />
                <div className="photo-booth">
                    <div ref={stripRef}
                         className="strip" />
                </div>
            </div>
        </div>
    );
};

