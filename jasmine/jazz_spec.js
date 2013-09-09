//     Specs for jshands.js 0.4 Alpha

//     (c) 2013 Troy Daniel
//     Jazz hands may be freely distributed under the MIT license.

describe("Jazz hands tests for Alpha version 0.4", function() {
  var jz;
  var options = { 
    fillStyle: "black"
  }
  
  beforeEach(function() {
    Jazz.init();
  });

    // TODO organize expectations into related tests
  describe("Prerequisite libraries loaded successfully.", function() {
    it("should have LEAP.js as a prerequisite library", function() {
      expect(jQuery).toBeDefined();
    });
    it("should have jQuery as a prerequisite library", function() {
      expect(jQuery).toBeDefined();
    });
    it("should be initialized as v0.4", function() {
      expect(Jazz.VERSION).toEqual("0.4");
    });
  });

  describe("Initialize successfully and as expected.", function() {

    it("should default to simpleMode of true", function() {
      expect(Jazz.simpleMode).toEqual(true);
    });
    it("should default to arrow color of black", function() {
      expect(Jazz.arrowColor).toEqual("black");
    });
    it("should default with disableZoom being false", function() {
      expect(Jazz.disableZoom).toEqual(false);
    });
    it("should have initialized images successfully", function() {
      expect(Jazz.upArrow.height).toEqual(30);
      expect(Jazz.downArrow.height).toEqual(30);
      expect(Jazz.rightArrow.height).toEqual(33);
      expect(Jazz.leftArrow.height).toEqual(33);
    });
  });

  describe("Have proper bindings for events", function() {
    it("should allow for bindings to finger events", function() {
      var binding = function(f) {return true;};
      Jazz.on("finger", binding);
      expect(Jazz.event["finger"]).toEqual(binding);
    });
    it("should allow for bindings to navigation events", function() {
      var binding = function(f) {return true;};
      Jazz.on("navigation", binding);
      expect(Jazz.event["navigation"]).toEqual(binding);
    });
    it("should allow for bindings to gesture events", function() {
      var binding = function(f) {return true;};
      Jazz.on("gesture", binding);
      expect(Jazz.event["gesture"]).toEqual(binding);
    });
  });


});