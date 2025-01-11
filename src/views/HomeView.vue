<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="position-relative">
    <div class="sticky-top m-0 bg-dark">
      <nav
        class="container navbar navbar-dark bg-dark"
        aria-label="Dark offcanvas navbar"
      >
        <div class="container-fluid">
          <span class="navbar-brand">&nbsp;&nbsp;JAED</span>
          <button
            @click="navbarTogglerClicked()"
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbarDark"
            aria-controls="offcanvasNavbarDark"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end text-bg-dark"
            tabindex="-1"
            id="offcanvasNavbarDark"
            aria-labelledby="offcanvasNavbarDarkLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarDarkLabel">
                Search
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <span
                    class="nav-link user-select-none"
                    @click="checkoutThisPlace()"
                    >Checkout This Place</span
                  >
                </li>

                <li class="nav-item">
                  <span
                    class="nav-link user-select-none"
                    @click="showAllCustomersHere()"
                    >Show All Customers Here</span
                  >
                </li>
                <!--
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <span class="dropdown-item user-select-none">Home</span>
                    </li>
                    <li>
                      <span class="dropdown-item user-select-none">Home</span>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <span class="dropdown-item user-select-none">Home</span>
                    </li>
                  </ul>
                </li>
                 -->
              </ul>
              <div class="d-flex mt-3" role="search">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search Key"
                  aria-label="Search"
                  v-model="customerID"
                />
                <button
                  class="btn btn-outline-success"
                  @click="customerSearch()"
                >
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="m-0 p-0" id="map" style="height: 95vh"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

const rawCustomerData = ref(null);
const rawPrilineData = ref(null);
const rawPripoleData = ref(null);
const rawSeclineData = ref(null);
const rawSecpoleData = ref(null);
const rawDistxmerData = ref(null);
const rawSavedCustomerFeaturesData = ref([]);
const rawSavedPrilineFeaturesData = ref([]);
const rawSavedPripoleFeaturesData = ref([]);
const rawSavedSeclineFeaturesData = ref([]);
const rawSavedSecpoleFeaturesData = ref([]);
const rawSavedDistxmerFeaturesData = ref(null);
const filteredCustomerData = ref(null);
const initialMap = ref(null);
const layer1 = ref(null);
const layer2 = ref(null);
const layer3 = ref(null);
const layer4 = ref(null);
const layer5 = ref(null);
const layer6 = ref(null);
const layer7 = ref(null);
const layer8 = ref(null);
const layer9 = ref(null);
const customerID = ref(null);
const GoogleLayerMap = ref(
  "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
);

const listOfCustomerFeatures = () => {
  rawSavedCustomerFeaturesData.value = [];
  for (var i = 0; i < rawCustomerData.value.features.length; i++) {
    rawSavedCustomerFeaturesData.value.push(rawCustomerData.value.features[i]);
  }

  filteredCustomerData.value = rawCustomerData.value;
  filteredCustomerData.value.features = [];
  var foundFeatureGeometry = null;
  for (i = 0; i < rawSavedCustomerFeaturesData.value.length; i++) {
    var feature = rawSavedCustomerFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (
          feature.properties.JAEDType == "VarLoad" &&
          feature.properties.CustomerID === customerID.value
        ) {
          foundFeatureGeometry = feature.geometry;
          L.circle(
            {
              lat: foundFeatureGeometry.coordinates[1],
              lng: foundFeatureGeometry.coordinates[0],
            },
            {
              color: "yellow",
              radius: 5,
              fillColor: "steelblue",
              opacity: 0.5,
            }
          ).addTo(initialMap.value);
          var tempMarker = L.marker([
            foundFeatureGeometry.coordinates[1],
            foundFeatureGeometry.coordinates[0],
          ]).addTo(initialMap.value);
          var popup = L.popup().setContent(
            "<b>" +
              feature.properties.CustomerID +
              "</b><br>" +
              feature.properties.CustomerName +
              "<br>" +
              feature.properties.Address +
              "<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
          tempMarker.bindPopup(popup).openPopup();
          break;
        }
  }
  if (foundFeatureGeometry) {
    for (i = 0; i < rawSavedCustomerFeaturesData.value.length; i++) {
      feature = rawSavedCustomerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "VarLoad") {
            var x2 = feature.geometry.coordinates[0];
            var y2 = feature.geometry.coordinates[1];
            var x1 = foundFeatureGeometry.coordinates[0];
            var y1 = foundFeatureGeometry.coordinates[1];
            var distance = Math.sqrt(
              (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
            );
            if (distance < 0.0006) {
              // approximately 50 meters
              filteredCustomerData.value.features.push(feature);
            }
          }
    }
    layer1.value = L.geoJson(filteredCustomerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#ff7800",
            color: "yellow",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.CustomerID +
            "</b><br>" +
            feature.properties.CustomerName +
            "<br>" +
            feature.properties.Address +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer1.value.addTo(initialMap.value);
    rawCustomerData.value.features = rawSavedCustomerFeaturesData.value;

    rawSavedSeclineFeaturesData.value = [];
    for (i = 0; i < rawSeclineData.value.features.length; i++) {
      rawSavedSeclineFeaturesData.value.push(rawSeclineData.value.features[i]);
    }
    rawSeclineData.value.features = [];
    for (i = 0; i < rawSavedSeclineFeaturesData.value.length; i++) {
      feature = rawSavedSeclineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSeclineData.value.features.push(feature);
            }
          }
    }
    layer5.value = L.geoJson(rawSeclineData.value, {
      style: {
        color: "#ff1144",
        weight: 3,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer5.value.addTo(initialMap.value);
    rawSeclineData.value.features = rawSavedSeclineFeaturesData.value;

    rawSavedSecpoleFeaturesData.value = [];
    for (i = 0; i < rawSecpoleData.value.features.length; i++) {
      rawSavedSecpoleFeaturesData.value.push(rawSecpoleData.value.features[i]);
    }
    rawSecpoleData.value.features = [];
    for (i = 0; i < rawSavedSecpoleFeaturesData.value.length; i++) {
      feature = rawSavedSecpoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSecpoleData.value.features.push(feature);
            }
          }
    }
    layer4.value = L.geoJson(rawSecpoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#ff1188",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer4.value.addTo(initialMap.value);
    rawSecpoleData.value.features = rawSavedSecpoleFeaturesData.value;

    rawSavedPrilineFeaturesData.value = [];
    for (i = 0; i < rawPrilineData.value.features.length; i++) {
      rawSavedPrilineFeaturesData.value.push(rawPrilineData.value.features[i]);
    }
    rawPrilineData.value.features = [];
    for (i = 0; i < rawSavedPrilineFeaturesData.value.length; i++) {
      feature = rawSavedPrilineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPrilineData.value.features.push(feature);
            }
          }
    }
    layer6.value = L.geoJson(rawPrilineData.value, {
      style: {
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer6.value.addTo(initialMap.value);
    rawPrilineData.value.features = rawSavedPrilineFeaturesData.value;

    rawSavedPripoleFeaturesData.value = [];
    for (i = 0; i < rawPripoleData.value.features.length; i++) {
      rawSavedPripoleFeaturesData.value.push(rawPripoleData.value.features[i]);
    }
    rawPripoleData.value.features = [];
    for (i = 0; i < rawSavedPripoleFeaturesData.value.length; i++) {
      feature = rawSavedPripoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPripoleData.value.features.push(feature);
            }
          }
    }
    layer3.value = L.geoJson(rawPripoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer3.value.addTo(initialMap.value);
    rawPripoleData.value.features = rawSavedPripoleFeaturesData.value;

    rawSavedDistxmerFeaturesData.value = [];
    for (i = 0; i < rawDistxmerData.value.features.length; i++) {
      rawSavedDistxmerFeaturesData.value.push(
        rawDistxmerData.value.features[i]
      );
    }
    rawDistxmerData.value.features = [];
    for (i = 0; i < rawSavedDistxmerFeaturesData.value.length; i++) {
      feature = rawSavedDistxmerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "DistXmer") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawDistxmerData.value.features.push(feature);
            }
          }
    }
    layer8.value = L.geoJson(rawDistxmerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 12,
            fillColor: "#221100",
            color: "#000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.Serial +
            " / " +
            feature.properties.CoopID +
            "</b><br>" +
            feature.properties.XmerID +
            "<br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.xKVA +
            "kVA<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer8.value.addTo(initialMap.value);
    rawDistxmerData.value.features = rawSavedDistxmerFeaturesData.value;

    // zoom to found customer
    initialMap.value.eachLayer((layer) => {
      if (layer.feature)
        if (layer.feature.properties)
          if (layer.feature.properties.JAEDType)
            if (
              layer.feature.properties.JAEDType === "VarLoad" &&
              layer.feature.properties.CustomerID === customerID.value
            ) {
              console.log("Found: ");
              console.log(layer.feature.properties.CustomerID);
              console.log(layer.feature.geometry.coordinates[1]);
              console.log(layer.feature.geometry.coordinates[0]);
              console.log(layer.feature.properties.CustomerName);
              console.log(layer.feature.properties.Address);
              console.log(layer.feature.properties.CustomerType);
              //layer.openPopup();
              initialMap.value.flyTo(
                new L.LatLng(
                  layer.feature.geometry.coordinates[1],
                  layer.feature.geometry.coordinates[0]
                ),
                19
              );
            }
    });
  }
};

const poleSearch = () => {
  rawSavedCustomerFeaturesData.value = [];
  for (var i = 0; i < rawCustomerData.value.features.length; i++) {
    rawSavedCustomerFeaturesData.value.push(rawCustomerData.value.features[i]);
  }
  filteredCustomerData.value = rawCustomerData.value;
  filteredCustomerData.value.features = [];

  var foundPriFeatureGeometry = null;
  var foundSecFeatureGeometry = null;

  for (i = 0; i < rawSecpoleData.value.features.length; i++) {
    feature = rawSecpoleData.value.features[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (
          feature.properties.JAEDType == "LVPole" &&
          feature.properties.PoleID === customerID.value
        ) {
          foundSecFeatureGeometry = feature.geometry;
          tempMarker = L.marker([
            foundSecFeatureGeometry.coordinates[1],
            foundSecFeatureGeometry.coordinates[0],
          ]).addTo(initialMap.value);
          popup = L.popup().setContent(
            "<b>" +
              feature.properties.PoleID +
              "</b><br>" +
              feature.properties.StructureType1 +
              "<br>" +
              feature.properties.PoleType +
              "<br>" +
              feature.properties.Height +
              "<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
          tempMarker.bindPopup(popup).openPopup();
          break;
        }
  }
  for (i = 0; i < rawPripoleData.value.features.length; i++) {
    var feature = rawPripoleData.value.features[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (
          feature.properties.JAEDType == "MVPole" &&
          feature.properties.PoleID === customerID.value
        ) {
          foundPriFeatureGeometry = feature.geometry;
          var tempMarker = L.marker([
            foundPriFeatureGeometry.coordinates[1],
            foundPriFeatureGeometry.coordinates[0],
          ]).addTo(initialMap.value);
          var popup = L.popup().setContent(
            "<b>" +
              feature.properties.PoleID +
              "</b><br>" +
              feature.properties.StructureType1 +
              "<br>" +
              feature.properties.PoleType +
              "<br>" +
              feature.properties.Height +
              "<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
          tempMarker.bindPopup(popup).openPopup();
          break;
        }
  }
  var foundFeatureGeometry = null;
  if (foundPriFeatureGeometry || foundSecFeatureGeometry) {
    if (foundPriFeatureGeometry) {
      foundFeatureGeometry = foundPriFeatureGeometry;
    } else {
      foundFeatureGeometry = foundSecFeatureGeometry;
    }
    for (i = 0; i < rawSavedCustomerFeaturesData.value.length; i++) {
      feature = rawSavedCustomerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "VarLoad") {
            var x2 = feature.geometry.coordinates[0];
            var y2 = feature.geometry.coordinates[1];
            var x1 = foundFeatureGeometry.coordinates[0];
            var y1 = foundFeatureGeometry.coordinates[1];
            var distance = Math.sqrt(
              (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
            );
            if (distance < 0.0011) {
              // approximately 100 meters
              filteredCustomerData.value.features.push(feature);
            }
          }
    }
    layer1.value = L.geoJson(filteredCustomerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#ff7800",
            color: "yellow",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.CustomerID +
            "</b><br>" +
            feature.properties.CustomerName +
            "<br>" +
            feature.properties.Address +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer1.value.addTo(initialMap.value);
    rawCustomerData.value.features = rawSavedCustomerFeaturesData.value;

    rawSavedSeclineFeaturesData.value = [];
    for (i = 0; i < rawSeclineData.value.features.length; i++) {
      rawSavedSeclineFeaturesData.value.push(rawSeclineData.value.features[i]);
    }
    rawSeclineData.value.features = [];
    for (i = 0; i < rawSavedSeclineFeaturesData.value.length; i++) {
      feature = rawSavedSeclineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSeclineData.value.features.push(feature);
            }
          }
    }
    layer5.value = L.geoJson(rawSeclineData.value, {
      style: {
        color: "#ff1144",
        weight: 3,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer5.value.addTo(initialMap.value);
    rawSeclineData.value.features = rawSavedSeclineFeaturesData.value;

    rawSavedSecpoleFeaturesData.value = [];
    for (i = 0; i < rawSecpoleData.value.features.length; i++) {
      rawSavedSecpoleFeaturesData.value.push(rawSecpoleData.value.features[i]);
    }
    rawSecpoleData.value.features = [];
    for (i = 0; i < rawSavedSecpoleFeaturesData.value.length; i++) {
      feature = rawSavedSecpoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSecpoleData.value.features.push(feature);
            }
          }
    }
    layer4.value = L.geoJson(rawSecpoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#ff1188",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer4.value.addTo(initialMap.value);
    rawSecpoleData.value.features = rawSavedSecpoleFeaturesData.value;

    rawSavedPrilineFeaturesData.value = [];
    for (i = 0; i < rawPrilineData.value.features.length; i++) {
      rawSavedPrilineFeaturesData.value.push(rawPrilineData.value.features[i]);
    }
    rawPrilineData.value.features = [];
    for (i = 0; i < rawSavedPrilineFeaturesData.value.length; i++) {
      feature = rawSavedPrilineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPrilineData.value.features.push(feature);
            }
          }
    }
    layer6.value = L.geoJson(rawPrilineData.value, {
      style: {
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer6.value.addTo(initialMap.value);
    rawPrilineData.value.features = rawSavedPrilineFeaturesData.value;

    rawSavedPripoleFeaturesData.value = [];
    for (i = 0; i < rawPripoleData.value.features.length; i++) {
      rawSavedPripoleFeaturesData.value.push(rawPripoleData.value.features[i]);
    }
    rawPripoleData.value.features = [];
    for (i = 0; i < rawSavedPripoleFeaturesData.value.length; i++) {
      feature = rawSavedPripoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPripoleData.value.features.push(feature);
            }
          }
    }
    layer3.value = L.geoJson(rawPripoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer3.value.addTo(initialMap.value);
    rawPripoleData.value.features = rawSavedPripoleFeaturesData.value;

    rawSavedDistxmerFeaturesData.value = [];
    for (i = 0; i < rawDistxmerData.value.features.length; i++) {
      rawSavedDistxmerFeaturesData.value.push(
        rawDistxmerData.value.features[i]
      );
    }
    rawDistxmerData.value.features = [];
    for (i = 0; i < rawSavedDistxmerFeaturesData.value.length; i++) {
      feature = rawSavedDistxmerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "DistXmer") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawDistxmerData.value.features.push(feature);
            }
          }
    }
    layer8.value = L.geoJson(rawDistxmerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 12,
            fillColor: "#221100",
            color: "#000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.Serial +
            " / " +
            feature.properties.CoopID +
            "</b><br>" +
            feature.properties.XmerID +
            "<br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.xKVA +
            "kVA<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer8.value.addTo(initialMap.value);
    rawDistxmerData.value.features = rawSavedDistxmerFeaturesData.value;

    // zoom to found customer
    initialMap.value.eachLayer((layer) => {
      if (layer.feature)
        if (layer.feature.properties)
          if (layer.feature.properties.JAEDType)
            if (layer.feature.properties.PoleID === customerID.value) {
              console.log("Found: ");
              console.log(layer.feature.properties.PoleID);
              console.log(layer.feature.geometry.coordinates[1]);
              console.log(layer.feature.geometry.coordinates[0]);
              console.log(layer.feature.properties.CustomerName);
              //layer.openPopup();
              initialMap.value.flyTo(
                new L.LatLng(
                  layer.feature.geometry.coordinates[1],
                  layer.feature.geometry.coordinates[0]
                ),
                19
              );
            }
    });
  }
};

const xmerSearch = () => {
  console.log("here xmerSearch");
  var foundDistxmerFeatureGeometry = null;
  for (i = 0; i < rawDistxmerData.value.features.length; i++) {
    let feature = rawDistxmerData.value.features[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (
          (feature.properties.JAEDType == "DistXmer" &&
            feature.properties.Serial === customerID.value) ||
          feature.properties.CoopID === customerID.value
        ) {
          foundDistxmerFeatureGeometry = feature.geometry;
          let tempMarker = L.marker([
            foundDistxmerFeatureGeometry.coordinates[1],
            foundDistxmerFeatureGeometry.coordinates[0],
          ]).addTo(initialMap.value);
          let popup = L.popup().setContent(
            "<b>" +
              feature.properties.Serial +
              " / " +
              feature.properties.CoopID +
              "</b><br>" +
              feature.properties.XmerID +
              "<br>" +
              feature.properties.Phase +
              "<br>" +
              feature.properties.xKVA +
              "kVA<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
          tempMarker.bindPopup(popup).openPopup();
          break;
        }
  }
  if (foundDistxmerFeatureGeometry) {
    var foundFeatureGeometry = foundDistxmerFeatureGeometry;
    rawSavedCustomerFeaturesData.value = [];
    for (var i = 0; i < rawCustomerData.value.features.length; i++) {
      rawSavedCustomerFeaturesData.value.push(
        rawCustomerData.value.features[i]
      );
    }
    filteredCustomerData.value = rawCustomerData.value;
    filteredCustomerData.value.features = [];
    for (i = 0; i < rawSavedCustomerFeaturesData.value.length; i++) {
      let feature = rawSavedCustomerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "VarLoad") {
            var x2 = feature.geometry.coordinates[0];
            var y2 = feature.geometry.coordinates[1];
            var x1 = foundFeatureGeometry.coordinates[0];
            var y1 = foundFeatureGeometry.coordinates[1];
            var distance = Math.sqrt(
              (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
            );
            if (distance < 0.0011) {
              // approximately 100 meters
              filteredCustomerData.value.features.push(feature);
            }
          }
    }
    layer1.value = L.geoJson(filteredCustomerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#ff7800",
            color: "yellow",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.CustomerID +
            "</b><br>" +
            feature.properties.CustomerName +
            "<br>" +
            feature.properties.Address +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer1.value.addTo(initialMap.value);
    rawCustomerData.value.features = rawSavedCustomerFeaturesData.value;

    rawSavedSeclineFeaturesData.value = [];
    for (i = 0; i < rawSeclineData.value.features.length; i++) {
      rawSavedSeclineFeaturesData.value.push(rawSeclineData.value.features[i]);
    }
    rawSeclineData.value.features = [];
    for (i = 0; i < rawSavedSeclineFeaturesData.value.length; i++) {
      let feature = rawSavedSeclineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSeclineData.value.features.push(feature);
            }
          }
    }
    layer5.value = L.geoJson(rawSeclineData.value, {
      style: {
        color: "#ff1144",
        weight: 3,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer5.value.addTo(initialMap.value);
    rawSeclineData.value.features = rawSavedSeclineFeaturesData.value;

    rawSavedSecpoleFeaturesData.value = [];
    for (i = 0; i < rawSecpoleData.value.features.length; i++) {
      rawSavedSecpoleFeaturesData.value.push(rawSecpoleData.value.features[i]);
    }
    rawSecpoleData.value.features = [];
    for (i = 0; i < rawSavedSecpoleFeaturesData.value.length; i++) {
      let feature = rawSavedSecpoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "LVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawSecpoleData.value.features.push(feature);
            }
          }
    }
    layer4.value = L.geoJson(rawSecpoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#ff1188",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer4.value.addTo(initialMap.value);
    rawSecpoleData.value.features = rawSavedSecpoleFeaturesData.value;

    rawSavedPrilineFeaturesData.value = [];
    for (i = 0; i < rawPrilineData.value.features.length; i++) {
      rawSavedPrilineFeaturesData.value.push(rawPrilineData.value.features[i]);
    }
    rawPrilineData.value.features = [];
    for (i = 0; i < rawSavedPrilineFeaturesData.value.length; i++) {
      let feature = rawSavedPrilineFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVLine") {
            x2 = feature.geometry.coordinates[0][0];
            y2 = feature.geometry.coordinates[0][1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPrilineData.value.features.push(feature);
            }
          }
    }
    layer6.value = L.geoJson(rawPrilineData.value, {
      style: {
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PhaseCondSize +
            " " +
            feature.properties.PhaseCondType +
            " " +
            feature.properties.PhaseCondStrands +
            " " +
            feature.properties.PhaseCondUnit +
            "</b><br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.length
        );
      },
    });
    layer6.value.addTo(initialMap.value);
    rawPrilineData.value.features = rawSavedPrilineFeaturesData.value;

    rawSavedPripoleFeaturesData.value = [];
    for (i = 0; i < rawPripoleData.value.features.length; i++) {
      rawSavedPripoleFeaturesData.value.push(rawPripoleData.value.features[i]);
    }
    rawPripoleData.value.features = [];
    for (i = 0; i < rawSavedPripoleFeaturesData.value.length; i++) {
      let feature = rawSavedPripoleFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "MVPole") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawPripoleData.value.features.push(feature);
            }
          }
    }
    layer3.value = L.geoJson(rawPripoleData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.PoleID +
            "</b><br>" +
            feature.properties.StructureType1 +
            "<br>" +
            feature.properties.PoleType +
            "<br>" +
            feature.properties.Height +
            "<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer3.value.addTo(initialMap.value);
    rawPripoleData.value.features = rawSavedPripoleFeaturesData.value;

    rawSavedDistxmerFeaturesData.value = [];
    for (i = 0; i < rawDistxmerData.value.features.length; i++) {
      rawSavedDistxmerFeaturesData.value.push(
        rawDistxmerData.value.features[i]
      );
    }
    rawDistxmerData.value.features = [];
    for (i = 0; i < rawSavedDistxmerFeaturesData.value.length; i++) {
      let feature = rawSavedDistxmerFeaturesData.value[i];
      if (feature.properties)
        if (feature.properties.JAEDType)
          if (feature.properties.JAEDType == "DistXmer") {
            x2 = feature.geometry.coordinates[0];
            y2 = feature.geometry.coordinates[1];
            x1 = foundFeatureGeometry.coordinates[0];
            y1 = foundFeatureGeometry.coordinates[1];
            distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (distance < 0.006) {
              // approximately 500 meters
              rawDistxmerData.value.features.push(feature);
            }
          }
    }
    layer8.value = L.geoJson(rawDistxmerData.value, {
      pointToLayer: (feature, latlng) => {
        if (latlng)
          return L.circleMarker(latlng, {
            radius: 12,
            fillColor: "#221100",
            color: "#000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          "<b>" +
            feature.properties.Serial +
            " / " +
            feature.properties.CoopID +
            "</b><br>" +
            feature.properties.XmerID +
            "<br>" +
            feature.properties.Phase +
            "<br>" +
            feature.properties.xKVA +
            "kVA<br>" +
            "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
            feature.geometry.coordinates[1] +
            "," +
            feature.geometry.coordinates[0] +
            "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
        );
      },
    });
    layer8.value.addTo(initialMap.value);
    rawDistxmerData.value.features = rawSavedDistxmerFeaturesData.value;

    // zoom to found customer
    initialMap.value.eachLayer((layer) => {
      if (layer.feature)
        if (layer.feature.properties)
          if (layer.feature.properties.JAEDType)
            if (
              layer.feature.properties.Serial === customerID.value ||
              layer.feature.properties.CoopID === customerID.value
            ) {
              console.log("Found: ");
              console.log(layer.feature.properties.XmerID);
              console.log(layer.feature.geometry.coordinates[1]);
              console.log(layer.feature.geometry.coordinates[0]);
              console.log(layer.feature.properties.xKVA);
              //layer.openPopup();
              initialMap.value.flyTo(
                new L.LatLng(
                  layer.feature.geometry.coordinates[1],
                  layer.feature.geometry.coordinates[0]
                ),
                19
              );
            }
    });
  }
};

const showAllCustomersHere = () => {
  var databounds = initialMap.value.getBounds();
  rawSavedCustomerFeaturesData.value = [];
  for (var i = 0; i < rawCustomerData.value.features.length; i++) {
    rawSavedCustomerFeaturesData.value.push(rawCustomerData.value.features[i]);
  }
  filteredCustomerData.value = rawCustomerData.value;
  filteredCustomerData.value.features = [];
  for (i = 0; i < rawSavedCustomerFeaturesData.value.length; i++) {
    var feature = rawSavedCustomerFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "VarLoad") {
          var x2 = feature.geometry.coordinates[0];
          var y2 = feature.geometry.coordinates[1];
          var miny1 = databounds._southWest.lat;
          var minx1 = databounds._southWest.lng;
          var maxy1 = databounds._northEast.lat;
          var maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            filteredCustomerData.value.features.push(feature);
          }
        }
  }
  layer1.value = L.geoJson(filteredCustomerData.value, {
    pointToLayer: (feature, latlng) => {
      if (latlng)
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: "#ff7800",
          color: "yellow",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9,
        });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.CustomerID +
          "</b><br>" +
          feature.properties.CustomerName +
          "<br>" +
          feature.properties.Address +
          "<br>" +
          "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
          feature.geometry.coordinates[1] +
          "," +
          feature.geometry.coordinates[0] +
          "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
      );
    },
  });
  layer1.value.addTo(initialMap.value);
  rawCustomerData.value.features = rawSavedCustomerFeaturesData.value;
};

const checkoutThisPlace = () => {
  var databounds = initialMap.value.getBounds();
  rawSavedSeclineFeaturesData.value = [];
  for (var i = 0; i < rawSeclineData.value.features.length; i++) {
    rawSavedSeclineFeaturesData.value.push(rawSeclineData.value.features[i]);
  }
  rawSeclineData.value.features = [];
  for (i = 0; i < rawSavedSeclineFeaturesData.value.length; i++) {
    var feature = rawSavedSeclineFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "LVLine") {
          var x2 = feature.geometry.coordinates[0][0];
          var y2 = feature.geometry.coordinates[0][1];
          var miny1 = databounds._southWest.lat;
          var minx1 = databounds._southWest.lng;
          var maxy1 = databounds._northEast.lat;
          var maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            rawSeclineData.value.features.push(feature);
          }
        }
  }
  layer5.value = L.geoJson(rawSeclineData.value, {
    style: {
      color: "#ff1144",
      weight: 3,
      opacity: 0.65,
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.PhaseCondSize +
          " " +
          feature.properties.PhaseCondType +
          " " +
          feature.properties.PhaseCondStrands +
          " " +
          feature.properties.PhaseCondUnit +
          "</b><br>" +
          feature.properties.Phase +
          "<br>" +
          feature.properties.length
      );
    },
  });
  layer5.value.addTo(initialMap.value);
  rawSeclineData.value.features = rawSavedSeclineFeaturesData.value;

  rawSavedSecpoleFeaturesData.value = [];
  for (i = 0; i < rawSecpoleData.value.features.length; i++) {
    rawSavedSecpoleFeaturesData.value.push(rawSecpoleData.value.features[i]);
  }
  rawSecpoleData.value.features = [];
  for (i = 0; i < rawSavedSecpoleFeaturesData.value.length; i++) {
    feature = rawSavedSecpoleFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "LVPole") {
          x2 = feature.geometry.coordinates[0];
          y2 = feature.geometry.coordinates[1];
          miny1 = databounds._southWest.lat;
          minx1 = databounds._southWest.lng;
          maxy1 = databounds._northEast.lat;
          maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            rawSecpoleData.value.features.push(feature);
          }
        }
  }
  layer4.value = L.geoJson(rawSecpoleData.value, {
    pointToLayer: (feature, latlng) => {
      if (latlng)
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#ff1188",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.PoleID +
          "</b><br>" +
          feature.properties.StructureType1 +
          "<br>" +
          feature.properties.PoleType +
          "<br>" +
          feature.properties.Height +
          "<br>" +
          "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
          feature.geometry.coordinates[1] +
          "," +
          feature.geometry.coordinates[0] +
          "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
      );
    },
  });
  layer4.value.addTo(initialMap.value);
  rawSecpoleData.value.features = rawSavedSecpoleFeaturesData.value;

  rawSavedPrilineFeaturesData.value = [];
  for (i = 0; i < rawPrilineData.value.features.length; i++) {
    rawSavedPrilineFeaturesData.value.push(rawPrilineData.value.features[i]);
  }
  rawPrilineData.value.features = [];
  for (i = 0; i < rawSavedPrilineFeaturesData.value.length; i++) {
    feature = rawSavedPrilineFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "MVLine") {
          x2 = feature.geometry.coordinates[0][0];
          y2 = feature.geometry.coordinates[0][1];
          miny1 = databounds._southWest.lat;
          minx1 = databounds._southWest.lng;
          maxy1 = databounds._northEast.lat;
          maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            rawPrilineData.value.features.push(feature);
          }
        }
  }
  layer6.value = L.geoJson(rawPrilineData.value, {
    style: {
      color: "#ff7800",
      weight: 5,
      opacity: 0.65,
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.PhaseCondSize +
          " " +
          feature.properties.PhaseCondType +
          " " +
          feature.properties.PhaseCondStrands +
          " " +
          feature.properties.PhaseCondUnit +
          "</b><br>" +
          feature.properties.Phase +
          "<br>" +
          feature.properties.length
      );
    },
  });
  layer6.value.addTo(initialMap.value);
  rawPrilineData.value.features = rawSavedPrilineFeaturesData.value;

  rawSavedPripoleFeaturesData.value = [];
  for (i = 0; i < rawPripoleData.value.features.length; i++) {
    rawSavedPripoleFeaturesData.value.push(rawPripoleData.value.features[i]);
  }
  rawPripoleData.value.features = [];
  for (i = 0; i < rawSavedPripoleFeaturesData.value.length; i++) {
    feature = rawSavedPripoleFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "MVPole") {
          x2 = feature.geometry.coordinates[0];
          y2 = feature.geometry.coordinates[1];
          miny1 = databounds._southWest.lat;
          minx1 = databounds._southWest.lng;
          maxy1 = databounds._northEast.lat;
          maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            rawPripoleData.value.features.push(feature);
          }
        }
  }
  layer3.value = L.geoJson(rawPripoleData.value, {
    pointToLayer: (feature, latlng) => {
      if (latlng)
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.PoleID +
          "</b><br>" +
          feature.properties.StructureType1 +
          "<br>" +
          feature.properties.PoleType +
          "<br>" +
          feature.properties.Height +
          "<br>" +
          "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
          feature.geometry.coordinates[1] +
          "," +
          feature.geometry.coordinates[0] +
          "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
      );
    },
  });
  layer3.value.addTo(initialMap.value);
  rawPripoleData.value.features = rawSavedPripoleFeaturesData.value;

  rawSavedDistxmerFeaturesData.value = [];
  for (i = 0; i < rawDistxmerData.value.features.length; i++) {
    rawSavedDistxmerFeaturesData.value.push(rawDistxmerData.value.features[i]);
  }
  rawDistxmerData.value.features = [];
  for (i = 0; i < rawSavedDistxmerFeaturesData.value.length; i++) {
    feature = rawSavedDistxmerFeaturesData.value[i];
    if (feature.properties)
      if (feature.properties.JAEDType)
        if (feature.properties.JAEDType == "DistXmer") {
          x2 = feature.geometry.coordinates[0];
          y2 = feature.geometry.coordinates[1];
          miny1 = databounds._southWest.lat;
          minx1 = databounds._southWest.lng;
          maxy1 = databounds._northEast.lat;
          maxx1 = databounds._northEast.lng;
          if (minx1 < x2 && x2 <= maxx1 && miny1 < y2 && y2 <= maxy1) {
            rawDistxmerData.value.features.push(feature);
          }
        }
  }
  layer8.value = L.geoJson(rawDistxmerData.value, {
    pointToLayer: (feature, latlng) => {
      if (latlng)
        return L.circleMarker(latlng, {
          radius: 12,
          fillColor: "#221100",
          color: "#000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<b>" +
          feature.properties.Serial +
          " / " +
          feature.properties.CoopID +
          "</b><br>" +
          feature.properties.XmerID +
          "<br>" +
          feature.properties.Phase +
          "<br>" +
          feature.properties.xKVA +
          "kVA<br>" +
          "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
          feature.geometry.coordinates[1] +
          "," +
          feature.geometry.coordinates[0] +
          "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
      );
    },
  });
  layer8.value.addTo(initialMap.value);
  rawDistxmerData.value.features = rawSavedDistxmerFeaturesData.value;
};

const navbarTogglerClicked = () => {
  initialMap.value.closePopup(); // close all popups before searching
};

const customerSearch = () => {
  initialMap.value.closePopup(); // close all popups before searching
  if (customerID.value.includes("C")) poleSearch();
  else if (customerID.value.includes("T")) xmerSearch();
  else listOfCustomerFeatures();
};

const changeDocumentTitle = (title, favicon_url) => {
  document.title = title;
  document.querySelectorAll("head link[rel]").forEach((link) => link.remove());
  let link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/jpg";
  link.href = favicon_url;
  document.getElementsByTagName("head")[0].appendChild(link);
};

onMounted(() => {
  changeDocumentTitle("JAED [CEBECO II]", "favicon1.jpg");
  initialMap.value = L.map("map").setView(
    [11.015566682201666, 123.9924500087559],
    17
  );

  initialMap.value.on("moveend", () => {
    var databounds = initialMap.value.getBounds();
    console.log(databounds._southWest.lat); //min lat
    console.log(databounds._southWest.lng); //min lng
    console.log(databounds._northEast.lat); //max lat
    console.log(databounds._northEast.lng); //max lng
    console.log(initialMap.value.getZoom());
  });

  // this prevents zoom animation error
  L.Popup.prototype._animateZoom = (e) => {
    if (!initialMap.value._map) {
      return;
    }
    var pos = initialMap.value._map._latLngToNewLayerPoint(
        initialMap.value._latlng,
        e.zoom,
        e.center
      ),
      anchor = initialMap.value._getAnchor();
    L.DomUtil.setPosition(initialMap.value._container, pos.add(anchor));
  };

  // add hybrid google map tile
  L.tileLayer(GoogleLayerMap.value, {
    maxZoom: 30,
  }).addTo(initialMap.value);

  fetch("mapassets/map1/map1_cons.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawCustomerData.value = data;
    });

  fetch("mapassets/map1/map1_subtranspole.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      layer2.value = L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 10,
            fillColor: "#447855",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(
            "<b>" +
              feature.properties.PoleID +
              "</b><br>" +
              feature.properties.StructureType1 +
              "<br>" +
              feature.properties.PoleType +
              "<br>" +
              feature.properties.Height +
              "<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
        },
      });
      layer2.value.addTo(initialMap.value);
    });

  fetch("mapassets/map1/map1_pripole.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawPripoleData.value = data;
    });

  fetch("mapassets/map1/map1_secpole.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawSecpoleData.value = data;
    });

  fetch("mapassets/map1/map1_secline.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawSeclineData.value = data;
    });

  fetch("mapassets/map1/map1_priline.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawPrilineData.value = data;
    });

  fetch("mapassets/map1/map1_distxmer.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rawDistxmerData.value = data;
    });

  fetch("mapassets/map1/map1_subtransline.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      layer7.value = L.geoJson(data, {
        style: {
          color: "yellow",
          weight: 7,
          opacity: 0.95,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(
            "<b>" +
              feature.properties.PhaseCondSize +
              " " +
              feature.properties.PhaseCondType +
              " " +
              feature.properties.PhaseCondStrands +
              " " +
              feature.properties.PhaseCondUnit +
              "</b><br>" +
              feature.properties.Phase +
              "<br>" +
              feature.properties.length
          );
        },
      });
      layer7.value.addTo(initialMap.value);
    });

  fetch("mapassets/map1/map1_powerxmer.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      layer9.value = L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: "powerxmer.png",
              iconSize: [30, 30], // size of the icon
              shadowSize: [30, 20], // size of the shadow
              iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
              shadowAnchor: [0, 0], // the same for the shadow
              popupAnchor: [15, -1], // point from which the popup should open relative to the iconAnchor
            }),
          });
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(
            "<b>" +
              feature.properties.XmerID +
              "</b><br>" +
              feature.properties.KVA +
              " kVA" +
              "<br>" +
              feature.properties.percentZ +
              "% Impedance" +
              "<br>" +
              feature.properties.KVp +
              "/" +
              feature.properties.KVs +
              " kV" +
              "<br>" +
              feature.properties.Brand +
              "<br>" +
              feature.properties.Model +
              "<br>" +
              "<a target='_blank' href='https://www.google.com/maps?q&layer=c&cbll=" +
              feature.geometry.coordinates[1] +
              "," +
              feature.geometry.coordinates[0] +
              "&cbp=0,0,0,0,0&z=18'>StreetView</a>"
          );
        },
      });
      layer9.value.addTo(initialMap.value);
    });
});
</script>

<style lang="scss" scoped></style>
