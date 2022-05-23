import React, {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const Video = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const [mostRecentPhoto, setInitialPhotoSrc] = useState("")
    const [ image, setImage ] = useState(null)

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    const onSubmitForm = async () => {
        console.log(mostRecentPhoto, "most recent")
        const body = {
            name: "DriverLicense",
            file: mostRecentPhoto
        }
        fetch(`https://b32lq6lxd2.execute-api.us-west-2.amazonaws.com/prod/images`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => setImage(data.image_path))
            .catch((error) => console.log('oh no :(', error))
    }

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({video: {width: 300}})
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
        const cWidth = document.documentElement.clientWidth;
        const cHeight = document.documentElement.clientHeight

        console.log(cWidth, cHeight, "videoCurrent")

        photo?.getContext('2d')?.drawImage(videoCurrent, 0, 0, 200, 200);
        const data = photo.toDataURL("image/jpeg");

        console.warn(data);
        const link = document.createElement("a");
        link.href = data;
        link.setAttribute("download", "myWebcam");
        link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
        // @ts-ignore
        strip?.insertBefore(link, strip?.firstChild);
        setInitialPhotoSrc(photo.toDataURL());
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <div className="webcam-video">
                    <Stack
                        sx={{pt: 4}}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button variant="contained"
                                onClick={() => takePhoto()}>
                            Take a photo
                        </Button>
                        <Button variant="contained"
                            onClick={onSubmitForm}
                        >Upload your Driver License</Button>
                        <Button variant="outlined">Secondary action</Button>
                    </Stack>
                    <br/>
                    <Container className={"Video container"}>
                        <video
                            width={"1000vw"}
                            ref={videoRef}
                            className="player"
                        />
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Last Photo:
                        </Typography>
                        <canvas ref={photoRef}
                                className="photo"/>
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            All previous photos
                        </Typography>
                        <div className="photo-booth">
                            <div ref={stripRef}
                                 className="strip"/>
                        </div>
                    </Container>
                </div>
            </Grid>
        </Container>
    );
};

