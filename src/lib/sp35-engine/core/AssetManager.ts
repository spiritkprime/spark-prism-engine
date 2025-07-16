import * as THREE from 'three';

export interface Asset {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'audio' | 'material';
  data: any;
  url?: string;
}

export class AssetManager {
  private assets: Map<string, Asset> = new Map();
  private loaders: {
    texture: THREE.TextureLoader;
    gltf: any; // GLTFLoader would be imported if needed
  };
  
  constructor() {
    this.loaders = {
      texture: new THREE.TextureLoader(),
      gltf: null // Could add GLTFLoader here
    };
    
    console.log('📦 Asset Manager initialized');
  }

  public async loadTexture(id: string, url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.loaders.texture.load(
        url,
        (texture) => {
          const asset: Asset = {
            id,
            name: url.split('/').pop() || id,
            type: 'texture',
            data: texture,
            url
          };
          
          this.assets.set(id, asset);
          console.log(`✅ Texture "${id}" loaded`);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`❌ Failed to load texture "${id}":`, error);
          reject(error);
        }
      );
    });
  }

  public createMaterial(id: string, config: any): THREE.Material {
    let material: THREE.Material;
    
    switch (config.type) {
      case 'phong':
        material = new THREE.MeshPhongMaterial(config);
        break;
      case 'standard':
        material = new THREE.MeshStandardMaterial(config);
        break;
      case 'basic':
        material = new THREE.MeshBasicMaterial(config);
        break;
      default:
        material = new THREE.MeshPhongMaterial(config);
    }
    
    const asset: Asset = {
      id,
      name: config.name || id,
      type: 'material',
      data: material
    };
    
    this.assets.set(id, asset);
    console.log(`🎨 Material "${id}" created`);
    
    return material;
  }

  public getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  public getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  public removeAsset(id: string): void {
    const asset = this.assets.get(id);
    if (asset) {
      // Dispose of the asset data if it has a dispose method
      if (asset.data && typeof asset.data.dispose === 'function') {
        asset.data.dispose();
      }
      
      this.assets.delete(id);
      console.log(`🗑️ Asset "${id}" removed`);
    }
  }

  public clear(): void {
    this.assets.forEach((asset, id) => {
      this.removeAsset(id);
    });
  }

  public dispose(): void {
    this.clear();
    console.log('🗑️ Asset Manager disposed');
  }
}