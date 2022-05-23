import React, {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {DriverLicenseResponse, IdentityDocumentField, ResponseFromCompareFaces} from "../../types";



export const Video = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const [mostRecentPhoto, setInitialPhotoSrc] = useState("")
    const [driverLicenseKey, setKeyRef] = useState("")
    const [isOver21, setAgeValidation] = useState(false);
    const [doFacesMatch, setFaceMatch] = useState(false)
    useEffect(() => {
        getVideo();
    }, [videoRef]);

    function getAge(dateString: string) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const checkBirthdate = (apiResponse: DriverLicenseResponse) => {
        const fields = apiResponse?.response?.IdentityDocuments[0]?.IdentityDocumentFields
        return fields.some((field: IdentityDocumentField) => {
            if(field.Type.Text === "DATE_OF_BIRTH"){
                const age = getAge(field.ValueDetection.Text);
                return age >= 21
            }
        })
    }

    const onSubmitDriverLicense = async () => {
        takePhoto();
        console.log(mostRecentPhoto, "most recent")
        const body = {
            name: "DriverLicense",
            file: mostRecentPhoto
        }
        fetch(`${process.env.REACT_APP_API_GATEWAY}/images`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then((data: DriverLicenseResponse) => {
                //TODO(miketran):  verify the person is over 21
                const isOver = checkBirthdate(data)
                setAgeValidation(isOver);
                if(isOver){
                    setKeyRef(data.driverLicenseKey)
                }
            })
            .catch((error) => console.log('oh no :(', error))
    }

    const onCompareFaces = async () => {
        takePhoto();
        const body = {
            name: "FaceComparison",
            file: mostRecentPhoto,
            firstBodyPath: driverLicenseKey
        }
        fetch(`${process.env.REACT_APP_API_GATEWAY}/compareFaces`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then((data: ResponseFromCompareFaces) => {
                if(data.response.FaceMatches.length > 0 && data.response.UnmatchedFaces.length === 0){
                    setFaceMatch(true);
                }
            })
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

        photo?.getContext('2d')?.drawImage(videoCurrent, 0, 0, photo.width, photo.height);
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

    // TODO: Better styling
    // TODO: Prevent double clicks
    return (
        <Container>
            {isOver21 && <Typography variant={"h1"}
                                     justifyContent="center"
            >This person is over 21</Typography>}
            {doFacesMatch && <Typography variant={"h1"}
                                         justifyContent="center"
            >The faces match</Typography>}
            <Grid container spacing={4}>
                <div className="webcam-video">
                    <Stack
                        sx={{pt: 4}}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >

                        <Button variant="contained"
                                onClick={onSubmitDriverLicense}
                        >Upload your Driver License</Button>
                        {driverLicenseKey.length > 0 && isOver21 && <Button variant="outlined"
                                                                onClick={onCompareFaces}
                        >
                            Compare your selfie with driver license
                        </Button>}
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
                                height={"662.50vh"}
                                width={"1000vw"}
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

