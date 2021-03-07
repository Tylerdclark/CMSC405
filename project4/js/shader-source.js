const vertexShader = `
attribute vec3 a_coords;
    attribute vec3 a_normal;   
    uniform mat4 modelview;
    uniform mat4 projection;   
    varying vec3 v_normal;
    varying vec3 v_eyeCoords;  
    void main() {
        vec4 coords = vec4(a_coords,1.0);
        vec4 eyeCoords = modelview * coords;
        gl_Position = projection * eyeCoords;
        v_normal = normalize(a_normal);
        v_eyeCoords = eyeCoords.xyz/eyeCoords.w;         
    }`;
    
const fragmentShader =  `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
       precision highp float;
    #else
       precision mediump float;
    #endif
    struct MaterialProperties {
        vec4 diffuseColor;      
        vec3 specularColor;
        vec3 emissiveColor;
        float specularExponent;
    };
    struct LightProperties {
        bool enabled;
        vec4 position;
        vec3 color;       
    };
    uniform MaterialProperties material; // do two-sided lighting, but assume front and back materials are the same
    uniform LightProperties lights[4];
    uniform mat3 normalMatrix;    
    varying vec3 v_normal;
    varying vec3 v_eyeCoords;
    
    vec3 lightingEquation( LightProperties light, MaterialProperties material, 
                                vec3 eyeCoords, vec3 N, vec3 V ) {
           // N is normal vector, V is direction to viewer.
        vec3 L, R; // Light direction and reflected light direction.      
        if ( light.position.w == 0.0 ) {
            L = normalize( light.position.xyz );
        }
        else {
            L = normalize( light.position.xyz/light.position.w - v_eyeCoords );            
        }
        if (dot(L,N) <= 0.0) {
            return vec3(0.0);
        }
        vec3 reflection = dot(L,N) * light.color * material.diffuseColor.rgb;
        R = -reflect(L,N);
        if (dot(R,V) > 0.0) {
            float factor = pow(dot(R,V),material.specularExponent);
            reflection += factor * material.specularColor * light.color;
        }
         return reflection;   
        
    }
    void main() {
        vec3 normal = normalize( normalMatrix*v_normal );
        vec3 viewDirection = normalize( -v_eyeCoords);  // (Assumes a perspective projection.)
        vec3 color = material.emissiveColor;
        
        for (int i = 0; i < 4; i++) {
            if (lights[i].enabled) { 
                if (gl_FrontFacing) {
                    color += lightingEquation( lights[i], material, v_eyeCoords,
                                                    normal, viewDirection);
                }
                else {
                    color += lightingEquation( lights[i], material, v_eyeCoords,
                                                    -normal, viewDirection);
                }
            }
        }               
       
        gl_FragColor = vec4(color,material.diffuseColor.a);        
    }
`;