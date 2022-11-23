GeoJson 是一种使用 JSON 编码（RFC7159）对各种地理数据结构进行编码的格式。

GeoJson 包含类型 Feature 和 FeatureCollection。 GeoJson 中的 Feature 对象包含一个 Geometry 对象，该对象具有上述几何类型之一和其他属性。 FeatureCollection 对象包含一个 Feature 对象数组。

在本文档中，术语“几何类型”指七个区分大小写的字符串: “ Point”、“ MultiPoint”、“ LineString”、“ MultiLineString”、“ Polygon”、“ MultiPolygon”和“ GeometryCollection”。
作为另一种速记符号，术语“ GeoJSON 类型”指的是九个区分大小写的字符串: “ Feature”、“ FeatureCollection”以及上面列出的几何类型。

Points
点坐标按x、 y 顺序排列(向东、向北为投影坐标，经度和纬度为地理坐标) :

{
  "type": "Point",
  "coordinates": [100.0, 0.0]
}

LineStrings
Linestring 的坐标是一个位置数组(见第 3.1.1 节)

{
  "type": "LineString",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}

Polygons
一个多边形的坐标是一个 linear ring 数组(见 3.1.6 节)的坐标数组。 数组中的第一个元素表示最外环。 任何后续元素都表示内部环(或孔)。

没有孔的情况:

{
  "type": "Polygon",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ]
}

MultiPoints
MultiPoints 的坐标是一个位置数组:

{
  "type": "MultiPoint",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}


MultiLineStrings
Multilinestring 的坐标是一个 ”LineString 坐标数组“组成的数组:

{
  "type": "MultiLineString",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 1.0]
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0]
    ]
  ]
}


MultiPolygons
MultiPolygons 的坐标是”Polygon 坐标数组“组成的数组:

{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0]
      ]
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ],
      [
        [100.2, 0.2],
        [100.2, 0.8],
        [100.8, 0.8],
        [100.8, 0.2],
        [100.2, 0.2]
      ]
    ]
  ]
}


{
  "type": "GeometryCollection",
  "geometries": [
    {
      "type": "Point",
      "coordinates": [100.0, 0.0]
    },
    {
      "type": "LineString",
      "coordinates": [
        [101.0, 0.0],
        [102.0, 1.0]
      ]
    }
  ]
}