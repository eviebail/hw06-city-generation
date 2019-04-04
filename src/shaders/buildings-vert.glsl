#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;
uniform mat4 u_Model;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.
in vec3 vs_R1;
in vec3 vs_R2;
in vec3 vs_R3;
in vec3 vs_Scale;

out vec4 fs_Col;
out vec4 fs_Pos;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;

    vec3 pos = 0.01 * vs_Pos.xyz + vs_Translate;
    gl_Position = u_ViewProj * vec4(4.0 * pos.x, 4.0* (pos.y + 0.02), 4.0 * pos.z, 1.0);
}
