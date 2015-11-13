precision highp float;
varying vec3 v_normal;
uniform vec4 u_ambient;
varying vec2 v_texcoord0;
uniform sampler2D u_diffuse;
uniform vec4 u_emission;
uniform vec4 u_specular;
uniform sampler2D u_bump;
uniform float u_shininess;
varying vec3 v_light0Direction;
varying vec3 v_position;
uniform vec3 u_light0Color;
varying vec3 v_light1Direction;
uniform float u_light1ConstantAttenuation;
uniform float u_light1LinearAttenuation;
uniform float u_light1QuadraticAttenuation;
uniform vec3 u_light1Color;
varying vec3 v_light2Direction;
uniform float u_light2ConstantAttenuation;
uniform float u_light2LinearAttenuation;
uniform float u_light2QuadraticAttenuation;
uniform vec3 u_light2Color;
varying vec3 v_light3Direction;
uniform float u_light3ConstantAttenuation;
uniform float u_light3LinearAttenuation;
uniform float u_light3QuadraticAttenuation;
uniform vec3 u_light3Color;
varying vec3 v_light4Direction;
uniform float u_light4ConstantAttenuation;
uniform float u_light4LinearAttenuation;
uniform float u_light4QuadraticAttenuation;
uniform vec3 u_light4Color;
varying vec3 v_light5Direction;
uniform float u_light5ConstantAttenuation;
uniform float u_light5LinearAttenuation;
uniform float u_light5QuadraticAttenuation;
uniform vec3 u_light5Color;
void main(void) {
vec3 normal = normalize(v_normal);
if (gl_FrontFacing == false) normal = -normal;
vec4 color = vec4(0., 0., 0., 0.);
vec4 diffuse = vec4(0., 0., 0., 1.);
vec3 diffuseLight = vec3(0., 0., 0.);
vec4 emission;
vec4 ambient;
vec4 specular;
ambient = u_ambient;
diffuse = texture2D(u_diffuse, v_texcoord0);
emission = u_emission;
specular = u_specular;
vec3 specularLight = vec3(0., 0., 0.);
{
float specularIntensity = 0.;
float attenuation = 1.0;
vec3 l = normalize(v_light0Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light0Color * specularIntensity;
diffuseLight += u_light0Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light1Direction);
attenuation = 1.0 / ( u_light1ConstantAttenuation + (u_light1LinearAttenuation * range) + (u_light1QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light1Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light1Color * specularIntensity;
diffuseLight += u_light1Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light2Direction);
attenuation = 1.0 / ( u_light2ConstantAttenuation + (u_light2LinearAttenuation * range) + (u_light2QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light2Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light2Color * specularIntensity;
diffuseLight += u_light2Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light3Direction);
attenuation = 1.0 / ( u_light3ConstantAttenuation + (u_light3LinearAttenuation * range) + (u_light3QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light3Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light3Color * specularIntensity;
diffuseLight += u_light3Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light4Direction);
attenuation = 1.0 / ( u_light4ConstantAttenuation + (u_light4LinearAttenuation * range) + (u_light4QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light4Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light4Color * specularIntensity;
diffuseLight += u_light4Color * max(dot(normal,l), 0.) * attenuation;
}
{
float specularIntensity = 0.;
float attenuation = 1.0;
float range = length(v_light5Direction);
attenuation = 1.0 / ( u_light5ConstantAttenuation + (u_light5LinearAttenuation * range) + (u_light5QuadraticAttenuation * range * range) ) ;
vec3 l = normalize(v_light5Direction);
vec3 position = v_position;
float phongTerm = max(0.0, dot(reflect(-l,normal), normalize(-position)));
specularIntensity = max(0., pow(phongTerm , u_shininess)) * attenuation;
specularLight += u_light5Color * specularIntensity;
diffuseLight += u_light5Color * max(dot(normal,l), 0.) * attenuation;
}
specular.xyz *= specularLight;
color.xyz += specular.xyz;
diffuse.xyz *= diffuseLight;
color.xyz += diffuse.xyz;
color.xyz += emission.xyz;
color = vec4(color.rgb * diffuse.a, diffuse.a);
gl_FragColor = color;
}
