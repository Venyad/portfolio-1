import { MeshPhysicalMaterial } from 'three';
import { AlphaMode, RGB } from '../../three-components/gltf-instance/gltf-2.0.js';
import { Material as MaterialInterface } from './api.js';
import { LazyLoader, VariantData } from './model.js';
import { PBRMetallicRoughness } from './pbr-metallic-roughness.js';
import { TextureInfo } from './texture-info.js';
import { ThreeDOMElement } from './three-dom-element.js';
declare const $pbrMetallicRoughness: unique symbol;
declare const $normalTexture: unique symbol;
declare const $occlusionTexture: unique symbol;
declare const $emissiveTexture: unique symbol;
declare const $backingThreeMaterial: unique symbol;
declare const $applyAlphaCutoff: unique symbol;
declare const $getAlphaMode: unique symbol;
export declare const $lazyLoadGLTFInfo: unique symbol;
declare const $initialize: unique symbol;
export declare const $getLoadedMaterial: unique symbol;
export declare const $ensureMaterialIsLoaded: unique symbol;
export declare const $gltfIndex: unique symbol;
export declare const $setActive: unique symbol;
export declare const $variantIndices: unique symbol;
declare const $isActive: unique symbol;
export declare const $variantSet: unique symbol;
declare const $modelVariants: unique symbol;
declare const $name: unique symbol;
declare const $pbrTextures: unique symbol;
/**
 * Material facade implementation for Three.js materials
 */
export declare class Material extends ThreeDOMElement implements MaterialInterface {
    private [$pbrMetallicRoughness];
    private [$normalTexture];
    private [$occlusionTexture];
    private [$emissiveTexture];
    private [$lazyLoadGLTFInfo]?;
    private [$gltfIndex];
    private [$isActive];
    private [$variantSet];
    private [$name]?;
    readonly [$modelVariants]: Map<string, VariantData>;
    private [$pbrTextures];
    get [$backingThreeMaterial](): MeshPhysicalMaterial;
    constructor(onUpdate: () => void, gltfIndex: number, isActive: boolean, modelVariants: Map<string, VariantData>, correlatedMaterials: Set<MeshPhysicalMaterial>, name: string | undefined, lazyLoadInfo?: LazyLoader | undefined);
    private [$initialize];
    [$getLoadedMaterial](): Promise<MeshPhysicalMaterial>;
    private colorFromRgb;
    [$ensureMaterialIsLoaded](): void;
    ensureLoaded(): Promise<void>;
    get isLoaded(): boolean;
    get isActive(): boolean;
    [$setActive](isActive: boolean): void;
    get name(): string;
    set name(name: string);
    get pbrMetallicRoughness(): PBRMetallicRoughness;
    get normalTexture(): TextureInfo;
    get occlusionTexture(): TextureInfo;
    get emissiveTexture(): TextureInfo;
    get emissiveFactor(): RGB;
    get index(): number;
    [$variantIndices](): Set<number>;
    hasVariant(name: string): boolean;
    setEmissiveFactor(rgb: RGB | string): void;
    [$getAlphaMode](): string;
    [$applyAlphaCutoff](): void;
    setAlphaCutoff(cutoff: number): void;
    getAlphaCutoff(): number;
    setDoubleSided(doubleSided: boolean): void;
    getDoubleSided(): boolean;
    setAlphaMode(alphaMode: AlphaMode): void;
    getAlphaMode(): AlphaMode;
    /**
     * PBR Next properties.
     */
    get emissiveStrength(): number;
    setEmissiveStrength(emissiveStrength: number): void;
    get clearcoatFactor(): number;
    get clearcoatRoughnessFactor(): number;
    get clearcoatTexture(): TextureInfo;
    get clearcoatRoughnessTexture(): TextureInfo;
    get clearcoatNormalTexture(): TextureInfo;
    get clearcoatNormalScale(): number;
    setClearcoatFactor(clearcoatFactor: number): void;
    setClearcoatRoughnessFactor(clearcoatRoughnessFactor: number): void;
    setClearcoatNormalScale(clearcoatNormalScale: number): void;
    get ior(): number;
    setIor(ior: number): void;
    get sheenColorFactor(): RGB;
    get sheenColorTexture(): TextureInfo;
    get sheenRoughnessFactor(): number;
    get sheenRoughnessTexture(): TextureInfo;
    setSheenColorFactor(rgb: RGB | string): void;
    setSheenRoughnessFactor(roughness: number): void;
    get transmissionFactor(): number;
    get transmissionTexture(): TextureInfo;
    setTransmissionFactor(transmission: number): void;
    get thicknessFactor(): number;
    get thicknessTexture(): TextureInfo;
    get attenuationDistance(): number;
    get attenuationColor(): RGB;
    setThicknessFactor(thickness: number): void;
    setAttenuationDistance(attenuationDistance: number): void;
    setAttenuationColor(rgb: RGB | string): void;
    get specularFactor(): number;
    get specularTexture(): TextureInfo;
    get specularColorFactor(): RGB;
    get specularColorTexture(): TextureInfo;
    setSpecularFactor(specularFactor: number): void;
    setSpecularColorFactor(rgb: RGB | string): void;
    get iridescenceFactor(): number;
    get iridescenceTexture(): TextureInfo;
    get iridescenceIor(): number;
    get iridescenceThicknessMinimum(): number;
    get iridescenceThicknessMaximum(): number;
    get iridescenceThicknessTexture(): TextureInfo;
    setIridescenceFactor(iridescence: number): void;
    setIridescenceIor(ior: number): void;
    setIridescenceThicknessMinimum(thicknessMin: number): void;
    setIridescenceThicknessMaximum(thicknessMax: number): void;
    get anisotropyStrength(): number;
    get anisotropyRotation(): number;
    get anisotropyTexture(): TextureInfo;
    setAnisotropyStrength(strength: number): void;
    setAnisotropyRotation(rotation: number): void;
}
export {};