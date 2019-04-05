#version 300 es
precision highp float;

uniform float u_Time;
uniform sampler2D u_Texture;

in vec2 fs_Pos;

out vec4 out_Col;

#define FRAME
#define STARS
#define NOISE_HORIZON

vec3 SUN = normalize(vec3(-0.8, -1.0, 0.0));
vec3 MOON = normalize(vec3(-0.4, 0.4, 0.3));

//Code Adapted from https://www.shadertoy.com/view/MdBGRh. It's really cool!



float snoise(vec3 v);

float clouds(vec3 p) {
	vec3 q = p + vec3(-0.1, sin(p.y)*0.25, 1.0)*(0.01+u_Time);
	float v = 0.0;
	v += 0.550 * snoise(q*0.051);
	v += 0.250 * snoise(q*0.111);
	v += 0.125 * snoise(q*0.211);
	return v;
}

void main()
{	
	vec2 uv = fs_Pos.xy;
	vec2 pos = -1.0 + 2.0 * uv; //convert to screen space
	
	// setup the camera position to change the perspective of the clouds in the sky
	vec3 camTarget = vec3(-3.5, 4.0, 0.0);
	
	vec3 camPos = vec3(0.0, 1.0, -1.0);	
	vec3 up = vec3(0, 1, 0);
	
	vec3 camDir = normalize((camTarget - camPos));
	vec3 camLeft = normalize(cross(up, camDir));
	vec3 camUp = cross(camDir, camLeft);
	
	//our ray position is how far along our ndc coord is along the
	//camera's axes
	vec3 rayPos = camPos + normalize(camDir + pos.x * camLeft + pos.y * camUp);
	vec3 rayDir = normalize(rayPos - camPos); //just like rayPos - u_Eye
	
	float t = (20.0 - rayPos.y) / rayDir.y;		
	//base sky color
	vec3 col = vec3(87.0 * 0.2 / 255.0, 57.0 * 0.2 / 255.0, 178.0 * 0.2 / 255.0);	
				
		// generate the cloud position based on our t value and where our rayDir
		// is in the scene
		float cloudA = (smoothstep(0.0, 1.0, 50.0/t)) * 0.25;		
		float cloud = smoothstep(0.0, 0.8, 0.2+clouds(t * rayDir));		

		//add the color of the cloud to our background color
		col += vec3(cloudA * cloud);
						
		//apply noise to the face of the moon to get craters
		float ms = snoise(rayDir*20.0);
		vec3 mCol = vec3(0.3, 0.3, 0.3) - 0.1*ms*ms*ms;

		// add in the color of the moon based on its position and orientation
		// relative to our ray dir
		float cloudShade = 1.0 - smoothstep(0.2, 0.9 , cloud);
		float moonDot = dot(MOON, rayDir);
		float moonA = smoothstep(0.9985, 0.999, moonDot);		
		col += (moonA*cloudShade)*mCol;
		col += vec3(0.15) * smoothstep(0.91, 0.9985, moonDot);
		
		//add blinking starts and blend with color of clouds
		float star = cloudShade*smoothstep(0.925, 0.955, snoise(floor(rayDir*202.0)));
		col += clamp(star, 0.0, 1.0) * vec3(0.4);

		out_Col = vec4(col, 1.0);	
}



vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

//admittedly I don't understand everything in this function, but
//I attempted to comment what I could understand because their
//shader is super cool!
float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

//map out a square with the input vector as the lower corner

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// map these points on a square to a octahedron
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalize gradients between each of the mapped points p0-p3
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

