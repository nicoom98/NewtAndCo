import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

let mesh1, mesh2, plane1, plane2, currrentAngle, currrentOffset;
var animationId;

// === Scene & Camera ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 80);

// Lumière ambiante un peu plus forte
scene.add(new THREE.AmbientLight(0xffffff, 5));

// Lumière principale (DirectionalLight) avec ombres
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(50, 40, 50);
dirLight.castShadow = true;

scene.add(dirLight);

// Lumière secondaire pour remplir les ombres
const fillLight = new THREE.DirectionalLight(0xffffff, 2);
fillLight.position.set(50, -40, 50);
scene.add(fillLight);

// Lumière d'ambiance pour le ciel
const hemiLight = new THREE.HemisphereLight(0xddddff, 0x888888, 5);
scene.add(hemiLight);

// === Group principal ===
const group = new THREE.Group();
scene.add(group);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);


// === Loader SVG ===
var svgElement = document.getElementById('monSVG');
var svgString = new XMLSerializer().serializeToString(svgElement);
var loader = new SVGLoader();
var data = loader.parse(svgString);

// Calcul bbox
var bbox = new THREE.Box3();
data.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);
    shapes.forEach((shape) => {
        const geom = new THREE.ExtrudeGeometry(shape, {
            depth: 5,
            bevelEnabled: true,
            bevelSize: 1,
            bevelThickness: 1,
            bevelSegments: 3,
        });
        geom.computeBoundingBox();
        bbox.union(geom.boundingBox);
    });
});

// === Texte 3D ===
function addText(textFont, textColor, text, z, scale, invert = false) {
    const fontLoader = new FontLoader();

    fontLoader.load('../static/fonts/' + textFont, (font) => {
        const geom = new TextGeometry(text, {
            font,
            size: 10,
            bevelEnabled: false,
            depth: 0,
        });
        geom.computeBoundingBox();
        const center = geom.boundingBox.getCenter(new THREE.Vector3());
        geom.translate(-center.x, -center.y, -center.z);

        const mat = new THREE.MeshPhysicalMaterial({
            color: textColor,
            metalness: 0.5,
            roughness: 0.1,
            reflectivity: 1,
            clearcoat: 0.3,
            clearcoatRoughness: 0.1,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: -10,
            polygonOffsetUnits: -50,
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = z;
        mesh.scale.set(invert ? -scale : scale, scale, scale);
        group.add(mesh);
    });
}

// === Loader SVG dynamique pour les faces ===
function addSVG(svgId, svgColor, z, scale = 1, translateX, translateY) {
    const svgElement = document.getElementById(svgId);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const loader = new SVGLoader();
    const data = loader.parse(svgString);

    data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geom = new THREE.ExtrudeGeometry(shape, {
                depth: 0,
                bevelEnabled: false,
            });

            const mat = new THREE.MeshPhysicalMaterial({
                color: svgColor,
                metalness: 0.8,
                roughness: 0.2,
                reflectivity: 1,
                clearcoat: 0.3,
                clearcoatRoughness: 0.1,
                depthWrite: true,
                depthTest: true,
                polygonOffset: true,
                polygonOffsetFactor: -10,
                polygonOffsetUnits: -50,
            });
            const mesh = new THREE.Mesh(geom, mat);

            mesh.position.z = z;
            mesh.scale.set(scale, -scale, scale);
            mesh.translateY(translateY);
            mesh.translateX(translateX);
            group.add(mesh);
        });
    });
}
// === Création médaille ===
export function createMedal(colors, customization, separator) {


    cancelAnimationFrame(animationId);



    var container = document.getElementById('medal-container');

    var width = container.clientWidth;

    camera.aspect = 1;
    camera.updateProjectionMatrix();

    renderer.setSize(width, width);

    container.appendChild(renderer.domElement);
    renderer.localClippingEnabled = true;

    // === Loader SVG ===
    svgElement = document.getElementById('monSVG');
    svgString = new XMLSerializer().serializeToString(svgElement);
    loader = new SVGLoader();
    data = loader.parse(svgString);

    // Calcul bbox
    bbox = new THREE.Box3();
    data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geom = new THREE.ExtrudeGeometry(shape, {
                depth: 5,
                bevelEnabled: true,
                bevelSize: 1,
                bevelThickness: 1,
                bevelSegments: 3,
            });
            geom.computeBoundingBox();
            bbox.union(geom.boundingBox);
        });
    });

    group.clear();
    group.rotation.y = 0;
    group.updateMatrixWorld(true);
    const DUALCOLOR = 'color2' in colors;
    const textureLoader = new THREE.TextureLoader();

    if (DUALCOLOR) {
        currrentAngle = separator.angle;
        currrentOffset = separator.offset;
        plane2 = new THREE.Plane(
            new THREE.Vector3(
                Math.cos(THREE.MathUtils.degToRad(currrentAngle)),
                Math.sin(THREE.MathUtils.degToRad(currrentAngle)),
                0
            ),
            0
        );
        plane2.constant = -currrentOffset;
        plane1 = plane2.clone().negate();
    }

    data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geom = new THREE.ExtrudeGeometry(shape, {
                depth: 5,
                bevelEnabled: true,
                bevelSize: 1,
                bevelThickness: 1,
                bevelSegments: 3,
            });
            const center = bbox.getCenter(new THREE.Vector3());
            geom.translate(-center.x, -center.y, -center.z);
            geom.computeVertexNormals();

            // UVs
            geom.computeBoundingBox();
            const max = geom.boundingBox.max;
            const min = geom.boundingBox.min;
            const rangeX = max.x - min.x;
            const rangeY = max.y - min.y;
            const uvs = [];
            const pos = geom.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                uvs.push((x - min.x) / rangeX, (y - min.y) / rangeY);
            }
            geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

            // Mesh 1
            const material1 = new THREE.MeshPhysicalMaterial({
                color: 'color' in colors.color1 ? colors.color1.color : [],
                metalness: 0.8,
                roughness: 0.2,
                reflectivity: 1,
                clearcoat: 0.3,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 'opacity' in colors.color1 ? colors.color1.opacity : 1,
                side: THREE.DoubleSide,
                map:
                    'url' in colors.color1 ? textureLoader.load(colors.color1.url) : '',
                clippingPlanes: DUALCOLOR ? [plane1] : [],
                clipShadows: true,
            });
            mesh1 = new THREE.Mesh(geom, material1);
            mesh1.rotation.x = Math.PI;
            group.add(mesh1);

            // Mesh 2 si bicolore
            if (DUALCOLOR) {
                const material2 = new THREE.MeshPhysicalMaterial({
                    color: 'color' in colors.color2 ? colors.color2.color : [],
                    metalness: 0.8,
                    roughness: 0.2,
                    reflectivity: 1,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.1,
                    transparent: true,
                    opacity: 'opacity' in colors.color2 ? colors.color2.opacity : 1,
                    side: THREE.DoubleSide,
                    map:
                        'url' in colors.color2 ? textureLoader.load(colors.color2.url) : '',
                    clippingPlanes: [plane2],
                    clipShadows: true,
                });
                mesh2 = new THREE.Mesh(geom, material2);
                mesh2.rotation.x = Math.PI;
                group.add(mesh2);

                if ('url' in separator) {
                    const decalMaterial = new THREE.MeshPhysicalMaterial({
                        map: textureLoader.load(separator.url),
                        metalness: 0.8,
                        roughness: 0.2,
                        reflectivity: 1,
                        clearcoat: 0.3,
                        clearcoatRoughness: 0.1,
                        transparent: true,
                        alphaTest: 0.8,
                        polygonOffset: true,
                        polygonOffsetFactor: -10,
                        polygonOffsetUnits: -40,
                    });
                    placeDecalsOnDiagonalAuto(
                        mesh1,
                        currrentAngle,
                        decalMaterial,
                        separator.size,
                        separator.ratio,
                        separator.offset
                    );
                }
            }
        });
    });
    // Texte ou SVG
    if (customization.front.text === 'SVG') {
        addSVG(
            'monSVG2',
            customization.front.color,
            4,
            customization.front.size,
            customization.front.translateX,
            customization.front.translateY
        );
    } else {
        addText(
            customization.front.typo,
            customization.front.color,
            customization.front.text,
            4,
            0.8
        );
    }

    if (customization.back.text === 'SVG') {
        addSVG(
            'monSVG2',
            customization.back.color,
            -4,
            customization.back.size,
            customization.back.translateX,
            customization.back.translateY
        );
    } else {
        addText(
            customization.back.typo,
            customization.back.color,
            customization.back.text,
            -4,
            0.8,
            true
        );
    }

    animate();
}

function getDiagonalPoints(mesh, angleDeg, spacing = 10) {
    const bbox = new THREE.Box3().setFromObject(mesh);
    const center = bbox.getCenter(new THREE.Vector3());

    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;

    const angleRad = THREE.MathUtils.degToRad(angleDeg);

    // vecteur directeur (diagonale)
    const dir = new THREE.Vector2(
        Math.cos(angleRad),
        Math.sin(angleRad)
    ).normalize();

    // vecteur perpendiculaire (OFFSET)
    const perp = new THREE.Vector2(-dir.y, dir.x).normalize();

    // on applique l'offset
    const offsetVec = perp.multiplyScalar(currrentOffset);

    // longueur totale à couvrir
    const diagLength = Math.abs(width * dir.x) + Math.abs(height * dir.y);

    // nombre de points
    const steps = Math.ceil(diagLength / spacing);

    // point de départ
    const start = new THREE.Vector2(
        center.x - (dir.x * diagLength) / 2 + offsetVec.x,
        center.y - (dir.y * diagLength) / 2 + offsetVec.y
    );

    // génération des points
    const points = [];
    for (let i = 0; i <= steps; i++) {
        points.push(
            new THREE.Vector2(
                start.x + dir.x * i * spacing,
                start.y + dir.y * i * spacing
            )
        );
    }

    return points;
}

function placeDecalsOnDiagonalAuto(
    mesh,
    angleDeg,
    decalMaterial,
    targetWidth,
    ratio,
    offset = 0
) {
    if (!decalMaterial.map) return;

    // taille automatique selon la texture
    const decalSize = new THREE.Vector3(targetWidth, targetWidth / ratio, 1);
    const decalWidth = decalSize.x;

    // points le long de la diagonale espacés selon la largeur du decal
    const points = getDiagonalPoints(mesh, angleDeg, decalWidth);

    const bbox = new THREE.Box3().setFromObject(mesh);

    const angleRad = THREE.MathUtils.degToRad(angleDeg);
    const orientation = new THREE.Euler(0, 0, angleRad);

    points.forEach((point) => {
        const pos = new THREE.Vector3(point.x, point.y, bbox.max.z);

        // decal avant
        const decalGeom = new DecalGeometry(mesh, pos, orientation, decalSize);

        const decal = new THREE.Mesh(decalGeom, decalMaterial);
        group.add(decal);

        const center = bbox.getCenter(new THREE.Vector3());
        const mirroredPos = pos.clone();
        mirroredPos.z = center.z - (pos.z - center.z);

        const decalGeomMirror = new DecalGeometry(
            mesh,
            mirroredPos,
            orientation,
            decalSize
        );
        const decalMirror = new THREE.Mesh(decalGeomMirror, decalMaterial);
        group.add(decalMirror);
    });
}
// === Animation ===

const clock = new THREE.Clock();

function animate() {
    animationId = requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // 1️⃣ rotation en premier
    group.rotation.y += 0.75 * delta;


    // 2️⃣ ensuite calcul des normales
    if (plane2) {
        const normalLocal = new THREE.Vector3(
            Math.cos(THREE.MathUtils.degToRad(currrentAngle + 90)),
            Math.sin(THREE.MathUtils.degToRad(currrentAngle + 90)),
            0
        );

        const normalWorld = normalLocal.clone().applyQuaternion(group.quaternion);

        plane2.normal.copy(normalWorld);
        plane1.normal.copy(normalWorld.clone().negate());
    }

    renderer.render(scene, camera);
}









