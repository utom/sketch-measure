import { Layer, Document, Page, Frame, Group, Text, Shape } from 'sketch/dom'

export interface MeasureConfig {
  scale: number
  units: 'px' | 'pt' | 'dp'
  format: 'png' | 'jpg' | 'svg'
  colorFormat: 'hex' | 'rgb' | 'hsl'
  exportPath: string
  includeShadows: boolean
  includeBlurs: boolean
  byInfluence: boolean
  isAdvancedMode: boolean
}

export interface MeasurePoint {
  x: number
  y: number
}

export interface MeasureRect {
  x: number
  y: number
  width: number
  height: number
}

export interface LayerInfo {
  id: string
  name: string
  type: string
  frame: MeasureRect
  styles: LayerStyles
  visible: boolean
  locked: boolean
}

export interface LayerStyles {
  fills?: Fill[]
  borders?: Border[]
  shadows?: Shadow[]
  innerShadows?: InnerShadow[]
  blur?: Blur
  opacity: number
  borderRadius?: number
}

export interface Fill {
  type: 'color' | 'gradient' | 'pattern'
  color?: string
  gradient?: Gradient
  pattern?: Pattern
  enabled: boolean
}

export interface Border {
  color: string
  thickness: number
  position: 'center' | 'inside' | 'outside'
  enabled: boolean
}

export interface Shadow {
  color: string
  x: number
  y: number
  blur: number
  spread: number
  enabled: boolean
}

export interface InnerShadow extends Shadow {
  // Same as Shadow but applied inside
}

export interface Blur {
  type: 'gaussian' | 'motion' | 'zoom' | 'background'
  radius: number
  center?: MeasurePoint
  motionAngle?: number
  enabled: boolean
}

export interface Gradient {
  type: 'linear' | 'radial' | 'angular'
  from: MeasurePoint
  to: MeasurePoint
  stops: ColorStop[]
}

export interface ColorStop {
  position: number
  color: string
}

export interface Pattern {
  patternType: 'fill' | 'fit' | 'stretch' | 'tile'
  image: string
}

export interface TextInfo {
  content: string
  fontFamily: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  color: string
}

export interface Annotation {
  id: string
  type: 'overlay' | 'size' | 'spacing' | 'property' | 'note'
  layerId: string
  position: MeasurePoint
  content: string | number
  visible: boolean
  locked: boolean
}

export interface SizeAnnotation extends Annotation {
  type: 'size'
  dimension: 'width' | 'height' | 'both'
  value: number
}

export interface SpacingAnnotation extends Annotation {
  type: 'spacing'
  direction: 'horizontal' | 'vertical' | 'all'
  targetLayerId?: string
  value: number
}

export interface PropertyAnnotation extends Annotation {
  type: 'property'
  properties: string[]
  styles: LayerStyles
}

export interface NoteAnnotation extends Annotation {
  type: 'note'
  content: string
  fontSize: number
  backgroundColor: string
  textColor: string
}

export interface OverlayAnnotation extends Annotation {
  type: 'overlay'
  color: string
  opacity: number
}

export interface ExportSpec {
  document: DocumentInfo
  pages: PageInfo[]
  assets: AssetInfo[]
  colors: ColorInfo[]
  textStyles: TextStyleInfo[]
  measurements: Annotation[]
  config: MeasureConfig
}

export interface DocumentInfo {
  name: string
  id: string
  version: string
  colorProfile: string
  units: string
  scale: number
}

export interface PageInfo {
  id: string
  name: string
  frames: FrameInfo[]
  annotations: Annotation[]
}

export interface FrameInfo {
  id: string
  name: string
  frame: MeasureRect
  backgroundColor: string
  layers: LayerInfo[]
  flows: FlowInfo[]
}

export interface FlowInfo {
  id: string
  targetId: string
  animationType: 'none' | 'slideFromLeft' | 'slideFromRight' | 'slideFromTop' | 'slideFromBottom' | 'smartAnimate'
  duration: number
  easing: string
}

export interface AssetInfo {
  id: string
  name: string
  type: string
  format: string
  scale: number
  exportPath: string
}

export interface ColorInfo {
  id: string
  name: string
  color: string
  type: 'fill' | 'border' | 'shadow' | 'text'
}

export interface TextStyleInfo {
  id: string
  name: string
  fontFamily: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: number
  color: string
}

export interface PluginContext {
  command: any
  document: Document
  selection: Layer[]
  version: string
  plugin: any
}

// Modern Sketch API types for new features
export interface StackInfo {
  id: string
  direction: 'horizontal' | 'vertical'
  spacing: number
  alignment: 'start' | 'center' | 'end' | 'stretch'
  distribution: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround'
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export interface SmartAnimateInfo {
  duration: number
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  matchingLayers: string[]
}

export type MeasureLayer = Layer & {
  measureId?: string
  measureType?: string
  measureData?: any
}

export interface MeasureSettings {
  defaultUnits: 'px' | 'pt' | 'dp'
  defaultColorFormat: 'hex' | 'rgb' | 'hsl'
  showInfluenceRect: boolean
  autoExportAssets: boolean
  markColor: string
  fontSize: number
  backgroundColor: string
}