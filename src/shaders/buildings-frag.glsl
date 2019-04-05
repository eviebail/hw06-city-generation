#version 300 es
precision highp float;

uniform float u_Time;
uniform sampler2D u_Texture;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

float random(vec2 ab) 
{
	float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
	return fract(f);
}

float noise(in vec2 xy) 
{
	vec2 ij = floor(xy);
	vec2 uv = xy-ij;
	uv = uv*uv*(3.0-2.0*uv);
	

	float a = random(vec2(ij.x, ij.y ));
	float b = random(vec2(ij.x+1., ij.y));
	float c = random(vec2(ij.x, ij.y+1.));
	float d = random(vec2(ij.x+1., ij.y+1.));
	float k0 = a;
	float k1 = b-a;
	float k2 = c-a;
	float k3 = a-b-c+d;
	return (k0 + k1*uv.x + k2*uv.y + k3*uv.x*uv.y);
}

vec3 random3( vec3 p ) {
    return fract(sin(vec3(dot(p,vec3(127.1, 311.7, 191.999)),
                          dot(p,vec3(269.5, 183.3, 765.54)),
                          dot(p, vec3(420.69, 631.2,109.21))))
                 *43758.5453);
}

float WorleyNoise3D(vec3 p)
{
    // Tile the space
    vec3 pointInt = floor(p);
    vec3 pointFract = fract(p);

    float minDist = 1.0; // Minimum distance initialized to max.

    // Search all neighboring cells and this cell for their point
    for(int z = -1; z <= 1; z++)
    {
        for(int y = -1; y <= 1; y++)
        {
            for(int x = -1; x <= 1; x++)
            {
                vec3 neighbor = vec3(float(x), float(y), float(z));

                // Random point inside current neighboring cell
                vec3 point = random3(pointInt + neighbor);

                // Animate the point
                point = 0.5 + 0.5 * sin(u_Time * 0.01 + 6.2831 * point); // 0 to 1 range

                // Compute the distance b/t the point and the fragment
                // Store the min dist thus far
                vec3 diff = neighbor + point - pointFract;
                float dist = length(diff);
                minDist = min(minDist, dist);
            }
        }
    }
    return minDist;
}

void main()
{
    vec2 uv = vec2(0.5 * (fs_Pos.x + 4.0) / 4.0, 0.5 * (fs_Pos.y + 4.0) / 4.0);
    float density = vec4(texture(u_Texture, uv)).w;

    // Material base color (before shading)
    vec4 diffuseColor = vec4(1.0, 0.0, 0.5, 1.0);//texture(u_Texture, fs_UV);

    vec3 lightColor = vec3(145.0 / 255.0, 137.0 / 255.0, 129.0 / 255.0);
    vec3 darkColor = vec3(79.0 / 255.0, 76.0 / 255.0, 72.0 / 255.0);

    diffuseColor = vec4(mix(lightColor, darkColor, pow(fs_Pos.y, 1.0)), 1.0);

    //stars
    float r1 = WorleyNoise3D(fs_Pos.xyz*vec3(sin(u_Time*0.1 + 3.14159 * (fs_Pos.x + fs_Pos.y + fs_Pos.z) )));
	float r2 = WorleyNoise3D(fs_Pos.yzx*vec3(cos(u_Time*0.1 + 3.14159 * (fs_Pos.x + fs_Pos.y + fs_Pos.z) ), sin(u_Time*0.1 + 3.14159 * (fs_Pos.x + fs_Pos.y + fs_Pos.z) ), 1.0));
	float r3 = WorleyNoise3D(fs_Pos.zyx*vec3(sin(u_Time*0.5 + 3.14159 * (fs_Pos.x + fs_Pos.y + fs_Pos.z) ), cos(u_Time*0.5 + 3.14159 * (fs_Pos.x + fs_Pos.y + fs_Pos.z) ), 1.0));

    float color = pow(noise(fs_Pos.xy + 0.2), 30.0) * 20.0;
    vec3 intensity = vec3(1.0,1.0,1.0);//vec3(mix(0.7,1.0,fs_Pos.x*2.0 - 1.0));
	diffuseColor += vec4(vec3(color*r1, color*r2, color*r3)*intensity*vec3(255.0/255.0, 183.0/255.0, 43.0/255.0), 1.0); //255, 209, 119


    vec4 fs_LightVec = vec4(50.0, 50.0, -30.0, 1.0);

    vec4 fs_LightVec2 = vec4(0.0, -20.0, 50.0, 1.0);
    vec4 lightColor2 = vec4(171.0 * 0.5 / 255.0, 156.0 * 0.5 / 255.0, 216.0 * 0.5/ 255.0, 1.0); 

    if (dot(normalize(fs_Nor), normalize(fs_LightVec)) < 0.0) {
        lightColor2 = vec4(87.0 * 0.5 / 255.0, 57.0 * 0.5 / 255.0, 178.0 * 0.5 / 255.0, 1.0); //87, 57, 178
    }
    // Calculate the diffuse term for Lambert shading
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
    diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);

    float ambientTerm = 0.2;

    float lightIntensity = diffuseTerm + ambientTerm;

    diffuseTerm += 0.9 * dot(normalize(fs_Nor), normalize(fs_LightVec2));
    diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);

    lightIntensity += diffuseTerm + ambientTerm;

    // Avoid negative lighting values
    

       //Add a small float value to the color multiplier
                                                        //to simulate ambient lighting. This ensures that faces that are not
                                                        //lit by our point light are not completely black.

    // Compute final shaded color
    out_Col = vec4(diffuseColor.rgb * lightIntensity * lightColor2.rgb, 1.0);
}
