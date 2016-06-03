/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2016 - Michael Streb
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.michael-streb.de/projects/viewport
 *
 */
(function($) {

    $.widget('dops.advancedViewport', {

        options: {
            threshold: 0,
            thresholdTop: null,
            thresholdBottom: null,
            thresholdLeft: null,
            thresholdRight: null,
            segmentation: {
                topBottom: '50:50',
                leftRight: '50:50'
            },
            showViewports: false
        },

        viewport: {
            top: { top: null, bottom: null, left: null, right: null },
            bottom: { top: null, bottom: null, left: null, right: null },
            left: { top: null, bottom: null, left: null, right: null },
            right: { top: null, bottom: null, left: null, right: null },
            overall: { top: null, bottom: null, left: null, right: null }
        },

        viewportDisplayColors: {
            top: 'red',
            bottom: 'blue',
            left: 'green',
            right: 'yellow',
            overall: 'pink'
        },

        state: {
            top: false,
            bottom: false,
            left: false,
            right: false,
            above: false,
            below: false,
            leftOf: false,
            rightOf: false,
            overall: false
        },
        
        percent: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            overall: 0
        },

        _create: function() {
            this._setThresholds();
            this._addEventhandlers();
            this.inViewport();
            this._displayViewports();

            return this;
        },

        /**
         * Setzt die Grenzwerte pro Seite auf den allgemeinen Grenzwert, sofern der jeweilige Grenzwert null ist.
         * @returns {Boolean}
         */
        _setThresholds: function() {
            if (this.options.thresholdTop === null) {
                this.options.thresholdTop = this.options.threshold;
            }

            if (this.options.thresholdBottom === null) {
                this.options.thresholdBottom = this.options.threshold;
            }

            if (this.options.thresholdLeft === null) {
                this.options.thresholdLeft = this.options.threshold;
            }

            if (this.options.thresholdRight === null) {
                this.options.thresholdRight = this.options.threshold;
            }

            return true;
        },

        /**
         * Defines the dimension of the overall viewport and calls the methods that define the other viewports.
         * @returns {Boolean}
         */
        _detectViewport: function() {
            // Overall viewport
            scrollTop  = $(window).scrollTop();
            scrollLeft = $(window).scrollLeft();
            height     = $(window).height();
            width      = $(window).width();

            this.viewport.overall = {
                top:    scrollTop + this.options.thresholdTop,
                bottom: scrollTop + height - this.options.thresholdBottom,
                left:   scrollLeft + this.options.thresholdLeft,
                right:  scrollLeft + width - this.options.thresholdRight,
                height: height - this.options.thresholdBottom - this.options.thresholdTop,
                width:  width - this.options.thresholdRight - this.options.thresholdLeft
            };

            // Top and bottom viewport
            segmentation  = this.options.segmentation.topBottom.split(':');
            topSegment    = parseInt(segmentation[0], 10);
            bottomSegment = parseInt(segmentation[1], 10);

            this._detectTopViewport(segmentation[0]);
            this._detectBottomViewport(segmentation[1]);

            // Left and right viewport
            segmentation = this.options.segmentation.leftRight.split(':');
            leftSegment  = parseInt(segmentation[0], 10);
            rightSegment = parseInt(segmentation[1], 10);

            this._detectLeftViewport(segmentation[0]);
            this._detectRightViewport(segmentation[1]);

            return true;
        },

        /**
         * Defines the top viewport.
         * @param {string} segment
         * @returns {Boolean}
         */
        _detectTopViewport: function(segment) {
            if (parseInt(segment, 10) == segment
                    || segment.match(/%/)) {
                value                    = (segment.match(/%/)) ? parseInt(segment.replace(/%/, ''), 10) : parseInt(segment, 10);
                this.viewport.top        = jQuery.extend({}, this.viewport.overall);
                this.viewport.top.bottom = this.viewport.overall.height / 100 * value + this.viewport.overall.top;
                this.viewport.top.height = this.viewport.overall.height / 100 * value;
            } else if (segment.match(/px/)) {
                value                    = parseInt(segment.replace(/px/, ''), 10);
                this.viewport.top        = jQuery.extend({}, this.viewport.overall);
                this.viewport.top.bottom = value + this.viewport.overall.top;
                this.viewport.top.height = value;
            }

            return true;
        },

        /**
         * Defines the bottom viewport.
         * @param {string} segment
         * @returns {Boolean}
         */
        _detectBottomViewport: function(segment) {
            if (parseInt(segment, 10) == segment
                    || segment.match(/%/)) {
                value                       = (segment.match(/%/)) ? parseInt(segment.replace(/%/, ''), 10) : parseInt(segment, 10);
                this.viewport.bottom        = jQuery.extend({}, this.viewport.overall);
                this.viewport.bottom.top    = this.viewport.overall.height - (this.viewport.overall.height / 100 * value) + this.viewport.overall.top;
                this.viewport.bottom.height = this.viewport.overall.height / 100 * value;
            } else if (segment.match(/px/)) {
                value                       = parseInt(segment.replace(/px/, ''), 10);
                this.viewport.bottom        = jQuery.extend({}, this.viewport.overall);
                this.viewport.bottom.top    = this.viewport.overall.height - value + this.viewport.overall.top;
                this.viewport.bottom.height = value;
            }

            return true;
        },

        /**
         * Defines the left viewport.
         * @param {string} segment
         * @returns {Boolean}
         */
        _detectLeftViewport: function(segment) {
            if (parseInt(segment, 10) == segment
                    || segment.match(/%/)) {
                value                    = (segment.match(/%/)) ? parseInt(segment.replace(/%/, ''), 10) : parseInt(segment, 10);
                this.viewport.left       = jQuery.extend({}, this.viewport.overall);
                this.viewport.left.right = this.viewport.overall.width / 100 * leftSegment + this.viewport.overall.left;
                this.viewport.left.width = this.viewport.overall.width / 100 * leftSegment;
            } else if (segment.match(/px/)) {
                value                    = parseInt(segment.replace(/px/, ''), 10);
                this.viewport.left       = jQuery.extend({}, this.viewport.overall);
                this.viewport.left.right = value + this.viewport.overall.left;
                this.viewport.left.width = value;
            }

            return true;
        },

        /**
         * Defines the right viewport.
         * @param {string} segment
         * @returns {Boolean}
         */
        _detectRightViewport: function(segment) {
            if (parseInt(segment, 10) == segment
                    || segment.match(/%/)) {
                value                     = (segment.match(/%/)) ? parseInt(segment.replace(/%/, ''), 10) : parseInt(segment, 10);
                this.viewport.right       = jQuery.extend({}, this.viewport.overall);
                this.viewport.right.left  = this.viewport.overall.width - (this.viewport.overall.width / 100 * rightSegment) + this.viewport.overall.left;
                this.viewport.right.width = this.viewport.overall.width / 100 * rightSegment;
            } else if (segment.match(/px/)) {
                value                     = parseInt(segment.replace(/px/, ''), 10);
                this.viewport.right       = jQuery.extend({}, this.viewport.overall);
                this.viewport.right.left  = this.viewport.overall.width - value + this.viewport.overall.left;
                this.viewport.right.width = value;
            }

            return true;
        },

        /**
         * Detects the elements position and dimensions.
         * @returns {Boolean}
         */
        _detectElementPosition: function() {
            offset = $(this.element).offset();
            height = $(this.element).outerHeight();
            width  = $(this.element).outerWidth();

            this.elementBox = {
                top:    offset.top,
                bottom: offset.top + height,
                left:   offset.left,
                right:  offset.left + width,
                height: height,
                width:  width
            };

            return true;
        },

        /**
         * Adds the needed eventhandlers.
         * @returns {Boolean}
         */
        _addEventhandlers: function() {
            that = this;
            this._on($(window), { resize: 'inViewport', scroll: 'inViewport' });
            this._on($(window), { resize: function(event) {
                    that.inViewport();
                    that._displayViewports();
            }, scroll: function(event) {
                    that.inViewport();
                    that._displayViewports();
            }});

        return true;
        },
        
        _setTopState: function() {
            // Update outer viewport state
            stateAbove = (this.elementBox.bottom < this.viewport.top.top) ? true : false;
            if (stateAbove !== this.state.above) {
                this.state.above = stateAbove;
                this._trigger((stateAbove) ? 'aboveViewport' : 'notAboveViewport', null, { state: this.state, percent: this.percent });
            }
            
            // Update in viewport state
            stateTop = (this.percent.top > 0) ? true : false;
            if (stateTop !== this.state.top) {
                this.state.top   = stateTop;
                this._trigger((stateTop) ? 'inTopViewport' : 'notInTopViewport', null, { state: this.state, percent: this.percent });
            }

            return true;
        },
        
        _setBottomState: function() {
            // Update outer viewport state
            stateBelow = (this.elementBox.top > this.viewport.bottom.left) ? true : false;
            if (stateBelow !== this.state.below) {
                this.state.below = stateBelow;
                this._trigger((stateBelow) ? 'belowViewport' : 'notBelowViewport', null, { state: this.state, percent: this.percent });
            }
            
            // Update in viewport state
            stateBottom = (this.percent.bottom > 0) ? true : false;
            if (stateBottom !== this.state.bottom) {
                this.state.bottom = stateBottom;
                this._trigger((stateBottom) ? 'inBottomViewport' : 'notInBottomViewport', null, { state: this.state, percent: this.percent });
            }

            return true;
        },

        _setLeftState: function() {
            // Update outer viewport state
            stateLeftOf = (this.elementBox.right < this.viewport.left.left) ? true : false;
            if (stateLeftOf !== this.state.leftOf) {
                this.state.leftOf = stateLeftOf;
                this._trigger((stateLeftOf) ? 'leftOfViewport' : 'notLeftOfViewport', null, { state: this.state, percent: this.percent });
            }

            // Update in viewport state
            stateLeft = (this.percent.left > 0) ? true : false;
            if (stateLeft !== this.state.left) {
                this.state.left = stateLeft;
                this._trigger((stateLeft) ? 'inTopLeftport' : 'notInLeftViewport', null, { state: this.state, percent: this.percent });
            }

            return true;
        },

        _setRightState: function() {
            // Update outer viewport state
            stateRightOf = (this.elementBox.left > this.viewport.right.right) ? true : false;
            if (stateRightOf !== this.state.rightOf) {
                this.state.rightOf = stateRightOf;
                this._trigger((stateRightOf) ? 'rightOfViewport' : 'notRightOfViewport', null, { state: this.state, percent: this.percent });
            }

            // Update in viewport state
            stateRight = (this.percent.right > 0) ? true : false;
            if (stateRight !== this.state.right) {
                this.state.right = stateRight;
                this._trigger((stateRight) ? 'inRightViewport' : 'notInRightViewport', null, { state: this.state, percent: this.percent });
            }

            return true;
        },

        
        _setOverallState: function() {
            // Update overall viewport state
            stateOverall         = (this.percent.overall > 0) ? true : false;
            if (stateOverall !== this.state.overall) {
                this.state.overall = stateOverall;
                this._trigger((stateOverall === true) ? 'inViewport' : 'notInViewport', null, { state: this.state, percent: this.percent });
            }

            return true;
        },

        /**
         * Sets the element state for the different viewports.
         * @returns {Boolean}
         */
        _setState: function() {
            oldPercent = this.percent;

            this._setTopState();
            this._setBottomState();
            this._setLeftState();
            this._setRightState();
            this._setOverallState();

            this._manageClassAdditions();

            if (JSON.stringify(oldPercent) === JSON.stringify(this.percent)) {
                this._trigger('positionUpdate', null, { state: this.state, percent: this.percent });
            }

            return true;
        },

        /**
         * Adds and removes the viewport classes to and from the element.
         * @returns {Boolean}
         */
        _manageClassAdditions: function() {
            inAnyViewport = false;
            elem = $(this.element);

            for (viewport in this.state) {
                if (this.state[viewport] === true) {
                    inAnyViewport = true;
                    elem.addClass('in-' + viewport + '-viewport');
                } else {
                    elem.removeClass('in-' + viewport + '-viewport');
                }
            }

            if (inAnyViewport) {
                elem.addClass('in-viewport');
            } else {
                elem.removeClass('in-viewport');
            }

            return true;
        },

        /**
         * Validates if and how far the element in in the overall viewport.
         * @param {type} returnPercent
         * @returns {Nuimber}
         */
        inViewport: function(returnPercent) {
            this._detectViewport();
            this._detectElementPosition();

            this.inTopViewport();
            this.inBottomViewport();
            this.inLeftViewport();
            this.inRightViewport();

            maxPercent = this.elementBox.height / 100 * this.viewport.overall.height;
            maxPercent = (maxPercent > 100) ? 100 : maxPercent;

            var percent = {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            };

            if (this.elementBox.bottom > this.viewport.overall.top && this.elementBox.top < this.viewport.overall.bottom) {
                pxIn = this.elementBox.bottom - this.viewport.overall.top;
                percent.top = maxPercent / this.elementBox.height * pxIn;
                percent.top = (percent.top > 100) ? 100 : percent.top;
            }

            if (this.elementBox.top < this.viewport.overall.bottom && this.elementBox.bottom > this.viewport.overall.top) {
                pxIn = this.viewport.overall.bottom - this.elementBox.top;
                percent.bottom = maxPercent / this.elementBox.height * pxIn;
                percent.bottom = (percent.bottom > 100) ? 100 : percent.bottom;
            }

            if (this.elementBox.right > this.viewport.overall.left && this.elementBox.left < this.viewport.overall.right) {
                pxIn = this.elementBox.right - this.viewport.overall.left;
                percent.left = maxPercent / this.elementBox.width * pxIn;
                percent.left = (percent.left > 100) ? 100 : percent.left;
            }

            if (this.elementBox.left < this.viewport.overall.right && this.elementBox.right > this.viewport.overall.left) {
                pxIn = this.viewport.overall.right - this.elementBox.left;
                percent.right = maxPercent / this.elementBox.width * pxIn;
                percent.right = (percent.right > 100) ? 100 : percent.right;
            }

            this.percent.overall = 100 * (percent.top / 100) * (percent.bottom / 100) * (percent.left / 100) * (percent.right / 100);
            this._setState();

            return (!returnPercent) ? this.state.overall : this.percent.overall;
        },

        /**
         * Validates if and how far the element in in the top viewport.
         * @param {type} returnPercent
         * @returns {Nuimber}
         */
        inTopViewport: function(returnPercent) {
            this._detectViewport();
            this._detectElementPosition();

            maxPercent = 100 / this.elementBox.height * this.viewport.top.height;
            maxPercent = (maxPercent > 100) ? 100 : maxPercent;

            // Element box slides out to the bottom
            if (this.elementBox.bottom > this.viewport.top.top
                    && this.elementBox.bottom < this.viewport.top.bottom
                    && this.elementBox.top < this.viewport.top.top) {
                pxIn = this.elementBox.bottom - this.viewport.top.top;
                percent = maxPercent / this.elementBox.height * pxIn;
            }
            // Element box slides out to the top
            else if (this.elementBox.top > this.viewport.top.top 
                    && this.elementBox.top < this.viewport.top.bottom
                    && this.elementBox.bottom > this.viewport.top.bottom) {
                pxIn = this.viewport.top.bottom - this.elementBox.top;
                percent = maxPercent / this.elementBox.height * pxIn;
            }
            // Element box is outside of viewport
            else if (this.elementBox.top > this.viewport.top.bottom || this.elementBox.bottom < this.viewport.top.top) {
                percent = 0;
            }
            // Element box covers viewport
            else {
                percent = maxPercent;
            }

            this.percent.top = (percent > 100) ? 100 : percent;
            this._setState();

            return (!returnPercent) ? this.state.top : this.percent.top;
        },

        /**
         * Validates if and how far the element in in the bottom viewport.
         * @param {type} returnPercent
         * @returns {Nuimber}
         */
        inBottomViewport: function(returnPercent) {
            this._detectViewport();
            this._detectElementPosition();

            maxPercent = 100 / this.elementBox.height * this.viewport.bottom.height;
            maxPercent = (maxPercent > 100) ? 100 : maxPercent;

            // Element box slides out to the bottom
            if (this.elementBox.top > this.viewport.bottom.top
                    && this.elementBox.top < this.viewport.bottom.bottom
                    && this.elementBox.bottom > this.viewport.bottom.bottom) {
                pxIn = this.viewport.bottom.bottom - this.elementBox.top;
                percent = maxPercent / this.elementBox.height * pxIn;
            }
            // Element box slides out to the top
            else if (this.elementBox.bottom < this.viewport.bottom.bottom
                    && this.elementBox.bottom > this.viewport.bottom.top
                    && this.elementBox.top < this.viewport.bottom.top) {
                pxIn = this.elementBox.bottom - this.viewport.bottom.top;
                percent = maxPercent / this.elementBox.height * pxIn;
            }
            // Element box is outside of viewport
            else if (this.elementBox.top > this.viewport.bottom.left || this.elementBox.bottom < this.viewport.bottom.right) {
                percent = 0;
            }
            // Element box covers viewport
            else {
                percent = maxPercent;
            }

            this.percent.bottom = (percent > 100) ? 100 : percent;
            this._setState();

            return (!returnPercent) ? this.state.bottom : this.percent.bottom;
        },

        /**
         * Validates if and how far the element in in the left viewport.
         * @param {type} returnPercent
         * @returns {Nuimber}
         */
        inLeftViewport: function(returnPercent) {
            this._detectViewport();
            this._detectElementPosition();

            maxPercent = 100 / this.elementBox.width * this.viewport.left.width;
            maxPercent = (maxPercent > 100) ? 100 : maxPercent;

            // Element box slides out to the right
            if (this.elementBox.left < this.viewport.left.right
                    && this.elementBox.left > this.viewport.left.left
                    && this.elementBox.right > this.viewport.left.right) {
                pxIn = this.viewport.left.right - this.elementBox.left;
                percent = maxPercent / this.viewport.left.width * pxIn;
            }
            // Element box slides out to the left
            else if (this.elementBox.left < this.viewport.left.left
                    && this.elementBox.right < this.viewport.left.right
                    && this.elementBox.right > this.viewport.left.left) {
                pxIn = this.elementBox.right - this.viewport.left.left;
                percent = maxPercent / this.elementBox.width * pxIn;
            }
            // Element box is outside of viewport
            else if (this.elementBox.left > this.viewport.left.left || this.elementBox.right < this.viewport.left.right) {
                percent = 0;
            }
            // Element box covers viewport
            else {
                percent = maxPercent;
            }

            this.percent.left = (percent > 100) ? 100 : percent;
            this._setState();

            return (!returnPercent) ? this.state.left : this.percent.left;
        },

        /**
         * Validates if and how far the element in in the right viewport.
         * @param {type} returnPercent
         * @returns {Nuimber}
         */
        inRightViewport: function(returnPercent) {
            this._detectViewport();
            this._detectElementPosition();

            maxPercent = 100 / this.elementBox.width * this.viewport.right.width;
            maxPercent = (maxPercent > 100) ? 100 : maxPercent;

            // Element box slides out to the left
            if (this.elementBox.right > this.viewport.right.left
                    && this.elementBox.right < this.viewport.right.right
                    && this.elementBox.left < this.viewport.right.left) {
                pxIn = this.elementBox.right - this.viewport.right.left;
                percent = maxPercent / this.elementBox.width * pxIn;
            }
            // Element box slides out to the right
            else if (this.elementBox.left > this.viewport.right.left
                    && this.elementBox.left < this.viewport.right.right
                    && this.elementBox.right > this.viewport.right.right) {
                pxIn = this.viewport.right.right - this.elementBox.left;
                percent = maxPercent / this.elementBox.width * pxIn;
            }
            // Element box is outside of viewport
            else if (this.elementBox.right < this.viewport.right.left || this.elementBox.left > this.viewport.right.right) {
                percent = 0;
            }
            // Element box covers viewport
            else {
                percent = maxPercent;
            }

            this.percent.right = (percent > 100) ? 100 : percent;
            this._setState();

            return (!returnPercent) ? this.state.right : this.percent.right;
        },

        /**
         * Displays a specific or all viewports depending on the options.
         * @returns {Boolean}
         */
        _displayViewports: function() {
            $('.viewport-display').remove();

            if (this.options.showViewports !== false) {

                if (this.options.showViewports !== 'all') {
                    overlay = $('<div id="viewport-' + this.options.showViewports + '" class="viewport-display">').css({
                        position: 'absolute',
                        top: this.viewport[this.options.showViewports].top,
                        left: this.viewport[this.options.showViewports].left,
                        height: this.viewport[this.options.showViewports].height,
                        width: this.viewport[this.options.showViewports].width,
                        'background-color': this.viewportDisplayColors[this.options.showViewports],
                        opacity: 0.3
                    });

                    $('body').append(overlay);
                } else {
                    for (viewport in this.viewport) {
                        overlay = $('<div id="viewport-' + viewport + '" class="viewport-display">').css({
                            position: 'absolute',
                            top: this.viewport[viewport].top,
                            left: this.viewport[viewport].left,
                            height: this.viewport[viewport].height,
                            width: this.viewport[viewport].width,
                            'background-color': this.viewportDisplayColors[viewport],
                            opacity: 0.3
                        });

                        $('body').append(overlay);
                    }
                }
            }

            return true;
        }

    });
    
})(jQuery);