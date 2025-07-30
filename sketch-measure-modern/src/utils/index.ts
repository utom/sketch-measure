import { Document, Layer, Frame, Group, Text, Shape } from 'sketch/dom'
import { MeasureRect, MeasurePoint, LayerInfo, LayerStyles } from '../types'

/**
 * 获取图层的边界矩形
 */
export function getLayerBounds(layer: Layer, includeInfluence = false): MeasureRect {
  const frame = layer.frame
  
  if (!includeInfluence) {
    return {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height
    }
  }
  
  // 计算影响矩形（包括阴影、边框等）
  let bounds = {
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height
  }
  
  // 如果图层有样式，计算影响范围
  if ('style' in layer && layer.style) {
    const style = layer.style as any
    
    // 处理阴影
    if (style.shadows && style.shadows.length > 0) {
      style.shadows.forEach((shadow: any) => {
        if (shadow.enabled) {
          const shadowBounds = calculateShadowBounds(bounds, shadow)
          bounds = mergeBounds(bounds, shadowBounds)
        }
      })
    }
    
    // 处理边框
    if (style.borders && style.borders.length > 0) {
      style.borders.forEach((border: any) => {
        if (border.enabled && border.position === 'outside') {
          const borderExpansion = border.thickness
          bounds.x -= borderExpansion
          bounds.y -= borderExpansion
          bounds.width += borderExpansion * 2
          bounds.height += borderExpansion * 2
        }
      })
    }
  }
  
  return bounds
}

/**
 * 计算阴影的边界范围
 */
function calculateShadowBounds(layerBounds: MeasureRect, shadow: any): MeasureRect {
  const x = layerBounds.x + shadow.x - shadow.blur - shadow.spread
  const y = layerBounds.y + shadow.y - shadow.blur - shadow.spread
  const width = layerBounds.width + (shadow.blur + shadow.spread) * 2
  const height = layerBounds.height + (shadow.blur + shadow.spread) * 2
  
  return { x, y, width, height }
}

/**
 * 合并两个边界矩形
 */
function mergeBounds(bounds1: MeasureRect, bounds2: MeasureRect): MeasureRect {
  const left = Math.min(bounds1.x, bounds2.x)
  const top = Math.min(bounds1.y, bounds2.y)
  const right = Math.max(bounds1.x + bounds1.width, bounds2.x + bounds2.width)
  const bottom = Math.max(bounds1.y + bounds1.height, bounds2.y + bounds2.height)
  
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  }
}

/**
 * 计算两个图层之间的距离
 */
export function calculateDistance(layer1: Layer, layer2: Layer): {
  horizontal: number
  vertical: number
} {
  const bounds1 = getLayerBounds(layer1)
  const bounds2 = getLayerBounds(layer2)
  
  // 计算水平距离
  let horizontal = 0
  if (bounds1.x + bounds1.width <= bounds2.x) {
    // layer1 在 layer2 左侧
    horizontal = bounds2.x - (bounds1.x + bounds1.width)
  } else if (bounds2.x + bounds2.width <= bounds1.x) {
    // layer1 在 layer2 右侧
    horizontal = bounds1.x - (bounds2.x + bounds2.width)
  }
  
  // 计算垂直距离
  let vertical = 0
  if (bounds1.y + bounds1.height <= bounds2.y) {
    // layer1 在 layer2 上方
    vertical = bounds2.y - (bounds1.y + bounds1.height)
  } else if (bounds2.y + bounds2.height <= bounds1.y) {
    // layer1 在 layer2 下方
    vertical = bounds1.y - (bounds2.y + bounds2.height)
  }
  
  return { horizontal, vertical }
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return 'measure_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

/**
 * 格式化数值
 */
export function formatValue(value: number, units: 'px' | 'pt' | 'dp' = 'px'): string {
  const rounded = Math.round(value * 100) / 100
  return `${rounded}${units}`
}

/**
 * 颜色格式转换
 */
export function formatColor(color: any, format: 'hex' | 'rgb' | 'hsl' = 'hex'): string {
  if (!color) return '#000000'
  
  // 从Sketch颜色对象提取RGB值
  const r = Math.round(color.red * 255)
  const g = Math.round(color.green * 255)
  const b = Math.round(color.blue * 255)
  const a = color.alpha || 1
  
  switch (format) {
    case 'rgb':
      return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
    case 'hsl':
      const [h, s, l] = rgbToHsl(r, g, b)
      return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`
    case 'hex':
    default:
      return rgbToHex(r, g, b)
  }
}

/**
 * RGB转HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

/**
 * RGB转HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * 检查图层是否为Frame
 */
export function isFrame(layer: Layer): layer is Frame {
  return layer.type === 'Artboard' || layer.type === 'Frame'
}

/**
 * 检查图层是否为Group
 */
export function isGroup(layer: Layer): layer is Group {
  return layer.type === 'Group'
}

/**
 * 检查图层是否为Text
 */
export function isText(layer: Layer): layer is Text {
  return layer.type === 'Text'
}

/**
 * 检查图层是否为Shape
 */
export function isShape(layer: Layer): layer is Shape {
  return layer.type === 'Shape' || layer.type === 'ShapePath'
}

/**
 * 获取当前选中的图层
 */
export function getSelectedLayers(document: Document): Layer[] {
  const page = document.selectedPage
  return page.selectedLayers.layers || []
}

/**
 * 查找父级Frame
 */
export function findParentFrame(layer: Layer): Frame | null {
  let parent = layer.parent
  
  while (parent) {
    if (isFrame(parent)) {
      return parent
    }
    parent = parent.parent
  }
  
  return null
}

/**
 * 深度遍历图层
 */
export function walkLayers(layers: Layer[], callback: (layer: Layer) => void): void {
  layers.forEach(layer => {
    callback(layer)
    
    if ('layers' in layer && layer.layers) {
      walkLayers(layer.layers as Layer[], callback)
    }
  })
}

/**
 * 检查点是否在矩形内
 */
export function pointInRect(point: MeasurePoint, rect: MeasureRect): boolean {
  return point.x >= rect.x &&
         point.x <= rect.x + rect.width &&
         point.y >= rect.y &&
         point.y <= rect.y + rect.height
}

/**
 * 获取图层样式信息
 */
export function getLayerStyles(layer: Layer): LayerStyles {
  const styles: LayerStyles = {
    opacity: 1
  }
  
  if ('style' in layer && layer.style) {
    const style = layer.style as any
    
    styles.opacity = style.opacity || 1
    
    if (style.fills) {
      styles.fills = style.fills.map((fill: any) => ({
        type: fill.fillType === 0 ? 'color' : fill.fillType === 1 ? 'gradient' : 'pattern',
        color: fill.color ? formatColor(fill.color) : undefined,
        enabled: fill.enabled || false
      }))
    }
    
    if (style.borders) {
      styles.borders = style.borders.map((border: any) => ({
        color: formatColor(border.color),
        thickness: border.thickness || 1,
        position: border.position === 0 ? 'center' : border.position === 1 ? 'inside' : 'outside',
        enabled: border.enabled || false
      }))
    }
    
    if (style.shadows) {
      styles.shadows = style.shadows.map((shadow: any) => ({
        color: formatColor(shadow.color),
        x: shadow.x || 0,
        y: shadow.y || 0,
        blur: shadow.blur || 0,
        spread: shadow.spread || 0,
        enabled: shadow.enabled || false
      }))
    }
    
    if (style.innerShadows) {
      styles.innerShadows = style.innerShadows.map((shadow: any) => ({
        color: formatColor(shadow.color),
        x: shadow.x || 0,
        y: shadow.y || 0,
        blur: shadow.blur || 0,
        spread: shadow.spread || 0,
        enabled: shadow.enabled || false
      }))
    }
    
    if (style.blur) {
      styles.blur = {
        type: 'gaussian',
        radius: style.blur.radius || 0,
        enabled: style.blur.enabled || false
      }
    }
    
    if (style.borderOptions && style.borderOptions.cornerRadius !== undefined) {
      styles.borderRadius = style.borderOptions.cornerRadius
    }
  }
  
  return styles
}

/**
 * 显示消息
 */
export function showMessage(message: string): void {
  if (typeof sketch !== 'undefined' && sketch.UI) {
    sketch.UI.message(message)
  } else {
    console.log(message)
  }
}

/**
 * 显示错误消息
 */
export function showError(error: string): void {
  if (typeof sketch !== 'undefined' && sketch.UI) {
    sketch.UI.message(`❌ ${error}`)
  } else {
    console.error(error)
  }
}

/**
 * 显示成功消息
 */
export function showSuccess(message: string): void {
  if (typeof sketch !== 'undefined' && sketch.UI) {
    sketch.UI.message(`✅ ${message}`)
  } else {
    console.log(`✅ ${message}`)
  }
}