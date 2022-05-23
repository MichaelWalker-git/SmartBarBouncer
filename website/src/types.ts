
export interface BoundingBox {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
}

export interface SourceImageFace {
    BoundingBox: BoundingBox;
    Confidence: number;
}

export interface BoundingBox2 {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
}

export interface Landmark {
    Type: string;
    X: number;
    Y: number;
}

export interface Pose {
    Roll: number;
    Yaw: number;
    Pitch: number;
}

export interface Quality {
    Brightness: number;
    Sharpness: number;
}

export interface UnmatchedFace {
    BoundingBox: BoundingBox2;
    Confidence: number;
    Landmarks: Landmark[];
    Pose: Pose;
    Quality: Quality;
}

export interface RekoginitionRootObject {
    SourceImageFace: SourceImageFace;
    FaceMatches: any[];
    UnmatchedFaces: UnmatchedFace[];
}

export interface ResponseFromCompareFaces {
    compareFacesLicenseKey: string
    response: RekoginitionRootObject
}

export interface Type {
    Text: string;
}

export interface NormalizedValue {
    Value: Date;
    ValueType: string;
}

export interface ValueDetection {
    Text: string;
    Confidence: number;
    NormalizedValue: NormalizedValue;
}

export interface IdentityDocumentField {
    Type: Type;
    ValueDetection: ValueDetection;
}

export interface IdentityDocument {
    DocumentIndex: number;
    IdentityDocumentFields: IdentityDocumentField[];
}

export interface DocumentMetadata {
    Pages: number;
}

export interface RootObject {
    IdentityDocuments: IdentityDocument[];
    DocumentMetadata: DocumentMetadata;
    AnalyzeIDModelVersion: string;
}

export interface DriverLicenseResponse {
    driverLicenseKey: string,
    response: RootObject
}

