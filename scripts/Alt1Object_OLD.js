require.config({
  shim: {
    'rawinflate': {
      exports: 'RawDeflate.inflate'
    },
    'rawdeflate': {
      exports: 'RawDeflate.deflate'
    },
    'zlib.min': {
      exports: 'Zlib'
    },
    'inflate.min': {
      exports: 'Zlib'
    }
  }
});

define(['jbinary', 'rawinflate', 'rawdeflate','zlib.min'], function(jBinary, inflate, deflate,Zlib) {  
// Compressed structure
// Example: 01 00 00 00 01 00 00 00 XX XX XX XX BB BB BB BB Data<B> 00 00 00 00 00 00 00 00 00 00 00 00
// get one long
// get one long
// get size long
// get csize long
// savepos offset
// clog test offset csize size

// file appears to go
// 01 00 00 00 01 00 00 00 Uncompressed Size Decompressed Size
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00

// But if there is a 2nd resource like a texture
// file appears to go
// 01 00 00 00 01 00 00 00 Uncompressed Size CompressedSize <Data(CompressedSize)>
// ?? ?? ?? ?? Uncompressed CompressedSize <Data(CompressedSize)> 00 00 00 00 00 00 00 00
// ^^
// 174904  

// Which makes me think the 00's at the end are for if there is a resource in that spot or not.
// If its non zero then there is.

// Uncompressed structure
// From: http://forum.xentax.com/viewtopic.php?f=16&t=6965&sid=674e3b507e7f358bfa9dbbce772e4808&start=15
// dword       ??          //header??
// dword       ??          //model type
// float       Emission
// float_4     color1   // Array of 4 float values
// float_4     color2
// byte_76     ??
// dword       numMatrix
// dword       numVerts
// dword       ??          
// dword       numFaces

// byte_40 ???
// numVerts vertex {
//   float_3   posXYZ
//   float_3   normatXYZ
//   float_2   texUV
// }
// numMatrix Animation {
//   float_8 ???
// }
// numFaces Face {
//   word_3    index123
// }
//56212
//Face Data Size: 23232
//32980
var FileType = {
  'jBinary.all': 'Model',
  'jBinary.littleEndian': true,
  'jBinary.mimeType': 'application/Alt1Object',

  RGBA: {
    R: 'float',
    G: 'float',
    B: 'float',
    A: 'float'
  },

  vector: {
    X: 'float',
    Y: 'float',
    Z: 'float'
  },

  float2: {
    U: 'float',
    V: 'float'
  },

  // Interleaved
  vertInfo: {
    X: 'float',
    Y: 'float',
    Z: 'float',
    NX: 'float',
    NY: 'float',
    NZ: 'float',
    UV: ['array','float', 2],
  },

  matrix: {
    P: ['array','uint32',4],
    F: ['array','float',4]
  },

  face: {
    A: 'uint16',
    B: 'uint16',
    C: 'uint16'
  },

  Model: {
    _h: 'uint32',
    _modelType: 'uint32',
    emission: 'float',
    color1: 'RGBA',
    color2: 'RGBA',
    _unknown: ['skip',76],
    numMatrix: 'uint32',
    numVerts: 'uint32',
    _unknown2: 'uint32',
    numFaces: 'uint32',
    // 8 unknown and 1 vector? 
    _unknown3: ['skip',40],
    verts: ['array', 'vertInfo', 'numVerts'],
    matrix: ['array', 'matrix', 'numMatrix'], // SObject does not have bones? or its in another file?
    faces: ['array', 'face', 'numFaces']
  }
}

// To do, port a zlib inflate and deflate to be an extension/plugin to jBinary
var typeSet = {
    'jBinary.all': 'File',
    'jBinary.littleEndian': true,
    'jBinary.mimeType': 'application/Alt1Object',

    CompressedData: jBinary.Template({
      params: ['size','resource_type'],
      getBaseType: function() { return ['binary', this.size] },
      read: function(header) {
        // var compressData = this.baseRead().split('').map(function(e) {
        //     return e.charCodeAt(0);
        // });
        var compressData = this.binary.view.getBytes(header[this.size],this.binary.view._offset);
        //var compressData = this.baseRead().view.buffer;
        var inflate = new Zlib.Inflate(compressData);
        var output = inflate.decompress();

        //switch(header.identifier) {
        switch(this.resource_type) {
          case 0: // Model
            var b = new jBinary(output,FileType);
            output = b.read('Model');
            console.log('Model Data');
          break;
          case 1:
            console.log('Texture woo!!');
          break;
          default:
            //console.log('Unknown Type: '+header.identifier);
            console.log('Unknown Type: '+this.resource_type);
          break;
        }

        return output;
      },
      write: function(binary) {
        this.baseWrite(deflate(binary.read('string')));
      }
    }),

    ModelPart: {
      Model:   ['CompressedObject', 0],
      Texture: ['CompressedObject', 1],
      // Temp bypass textures

      // _a: 'uint32',
      // _textureSize: 'uint32',
      // _compressedSize: 'uint32',
      // _skipit: ['skip', '_compressedSize'],

      pad1: 'uint32',
      pad2: 'uint32' 
    },

    ModelPartTest: {
      TextureCount: 'uint32',
      Mesh:   ['CompressedObject', 0],
      Textures: ['array', 'TexturePart', 'TextureCount'],
      pad1: 'uint32'
      //pad2: 'uint32' 
    },

    TexturePart: {
      Exists: 'uint32',
      dds: ['if', function(x) { return x.Exists>0; }, ['CompressedObject', 1], ['skip',0] ]
    },

    File: {
      contentCount: 'uint32',
      //contents: ['array', 'ModelPart', 'contentCount']

      contents: ['array', 'ModelPartTest', 'contentCount']
      //contents: ['array', 'CompressedObject', 1]
    },

    // CompressedObject: {
    //   identifier: 'uint32', 
    //   size: 'uint32',
    //   compressedSize: 'uint32',
    //   content: ['CompressedData', 'compressedSize']
    // },

    CompressedObject: jBinary.Template({
      params: ['resource_type'],
      getBaseType: function() { 
      return {
          //identifier: 'uint32',
          size: 'uint32',
          compressedSize: 'uint32',
          content: ['CompressedData', 'compressedSize', this.resource_type]
        };
      }
    })
  };

  return function Alt1Object(filename, callback) {
    var self = this;

    function loaded(err, binary) {
          if (err) throw err;

          //console.log(binary);
          var uncompressedData = binary.readAll();
          //console.log(uncompressedData);
          var resource = uncompressedData;

          window.resource = resource;
          //document.write('<pre>');
          //document.write(getAnim8or(resource.contents.content));
          //document.write('</pre>');

          //debugger;

          callback && callback(filename, resource);
    }

    if (typeof(filename) === 'string') {
      jBinary.load(filename, typeSet, loaded);
    } else if (typeof(filename) === 'object' && filename.data !== undefined) {
      jBinary.loadData(filename.data, typeSet, loaded);
    } else if (typeof(filename) === 'object' && filename.file !== undefined) {
      jBinary.load(filename.file, typeSet, loaded);
    }
  };
});
