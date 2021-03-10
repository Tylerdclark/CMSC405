const vertexShader = `
    attribute vec3 a_coords;
    attribute vec3 a_normal;
    attribute vec2 a_texCoords;   
    uniform mat4 modelview;
    uniform mat4 projection;
    uniform mat3 textureTransform;   
    varying vec3 v_normal;
    varying vec3 v_eyeCoords;
    varying vec2 v_texCoords;  
    varying vec3 v_lighting;


    uniform vec3 uAmbientColor;
    uniform vec3 uLightingDirection;
    uniform vec3 uDirectionalColor;

    uniform bool uUseLighting;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;

    void main() {
        vec4 objectCoords = vec4(a_coords,1.0);
        vec4 eyeCoords = modelview * objectCoords;
        gl_Position = projection * eyeCoords;
        v_normal = normalize(a_normal);
        v_eyeCoords = eyeCoords.xyz/eyeCoords.w;
        vec3 texcoords = textureTransform * vec3(a_texCoords,1.0);
        v_texCoords = texcoords.xy;

        if (!uUseLighting) {
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        } else {
            vec3 transformedNormal = textureTransform * a_normal;
            float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
            vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
        }
    }`;
    
const fragmentShader =  `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
       precision highp float;
    #else
       precision mediump float;
    #endif
    uniform mat3 normalMatrix;
    uniform sampler2D texture;
    varying vec3 v_normal;
    varying vec3 v_eyeCoords;
    varying vec2 v_texCoords;
    varying vec3 vLightWeighting;
    void main() {
        vec3 N = normalize( normalMatrix*v_normal );
        vec3 L = normalize( -v_eyeCoords);  // (Assumes a perspective projection.)
        float diffuseFactor = dot(N,L);
        vec4 color = texture2D(texture, v_texCoords);
        gl_FragColor = vec4( color.rgb * vLightWeighting, 1.0);
    }
`;
